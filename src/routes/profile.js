const express = require("express")
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const { validateEditData, validateNewPassword } = require("../utils/validation");
const User = require("../models/user");


const SAFE_USER_DATA = "firstName lastName emailId imagUrl gender age skills about";
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(SAFE_USER_DATA);
    res.send(user);
  } catch (err) {
    res.send("Error:" + err.message);
  }
});

profileRouter.patch("/profile/edit",userAuth,async (req,res) =>{
  try{
    if(!validateEditData(req)){
      throw new Error("Invalid field request");
    }

    const loggedInUser = req.user;
    

    Object.keys(req.body).forEach(key=> (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your data was updated successfully`,
      user : loggedInUser
    })

  }catch(err){
    res.status(400).json({message: err.message})
  }
})

profileRouter.patch("/edit/password",async (req,res)=>{ 
  try{
    const {emailId,password,newPassword} = req.body;
   

    const findUser = await User.findOne({emailId});
    if(!findUser) throw new Error("Invalid credentials");
    
  const isValidPassword = await findUser.validatePassword(password);
  if(!isValidPassword){
    throw new Error("Current password does not match");
  }
  
  if(!validateNewPassword(req)){
    throw new Error("Invalid password")
  }

  const newPass = await bcrypt.hash(newPassword,10);
  findUser.password = newPass;

  await findUser.save();
  res.send("Password updated successfully!")

  }catch(err){
    res.status(400).send("ERROR: " + err.message);
  }
})

module.exports = profileRouter