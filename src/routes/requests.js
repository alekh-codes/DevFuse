const express = require("express")
const requestsRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
requestsRouter.post("/sendConnectionRequest", userAuth,(req,res)=>{

  const user = req.user;
  res.send(user.firstName + ' sends the connection request');
})