const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const SAFE_USER_DATA = "firstName lastName imagUrl gender age skills about";

userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requestConnection = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_DATA);

    res.json({
      message: "Data fetched successfully",
      data: requestConnection,
    });
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requestConnection = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    const data = requestConnection.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: `Connections of ${loggedInUser.firstName}`,
      user:data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    hideUsersFromFeed.add(loggedInUser._id.toString());

    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });

    const users = await User.find({
      _id: {
        $nin: Array.from(hideUsersFromFeed),
      },
    }).select(SAFE_USER_DATA);

    res.json({
      data: users,
    });

  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

userRouter.post("/deleteUser",userAuth,async(req,res) =>{
  try{
    const {_id} = req.user;


  await User.findByIdAndDelete(_id);
  res.json({message: "Account deleted!"})
  }
  catch(err){
    res.status(500).json({
      message: err.message
    })
  }
})
module.exports = userRouter;
