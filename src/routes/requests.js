const express = require("express");
const requestsRouter = express.Router();
const User  = require("../models/user")
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

     
      const allowedStatus = ["interested","ignored"];
      if(!allowedStatus.includes(status)){
        return res.json({
          message : `${status} is not a valid status`
        })
      }

      const toUser = await User.findById(toUserId);
      if(!toUser){
        return res.status(404).json({message:"User not found"})
      }


      const existingRequest = await ConnectionRequest.findOne({
        $or:[
          {fromUserId,toUserId},
          {fromUserId:toUserId,toUserId : fromUserId}
        ]
      })

      if(existingRequest){
        return res.json({
          message: "Connection request already sent!"
        })
      }

      const requestInfo = await connectionRequest.save();

      res.json({
        message: "connection request sent successfully",
        data: requestInfo,
      });
    } catch (err) {
      res.send("ERROR: " + err.message);
    } 
  },
);

module.exports = requestsRouter;
