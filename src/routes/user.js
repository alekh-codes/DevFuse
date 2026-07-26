const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/users/requests/received",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;

        const requestConnection = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status : "interested"
        }).populate("fromUserId",
            "imagUrl firstName lastName age gender about skills"
        )

        res.json({
            message : "Data fetched successfully",
            data : requestConnection
        })

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

const SAFE_USER_DATA = "firstName lastName imagUrl gender age skills"

userRouter.get("/users/connections",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;

        const requestConnection = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id, status:"accepted"},
                {fromUserId: loggedInUser._id, status:"accepted"}
            ]
            
        })
        .populate("fromUserId",SAFE_USER_DATA)
        .populate("toUserId",SAFE_USER_DATA)      

        const data = requestConnection.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })
         
        res.json({
            message : `Connections of ${loggedInUser.firstName}`,
            data 
        })
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})




module.exports = userRouter