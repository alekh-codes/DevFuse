const express = require("express")
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const { validateEditData, validateNewPassword } = require("../utils/validation");


profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
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
      data : loggedInUser
    })

  }catch(err){
    res.status(400).send("ERROR: " + err.message);
  }
})

profileRouter.patch("/profile/password",userAuth,async (req,res)=>{
  try{
    const {password,newPassword} = req.body;
    const user = req.user;

  const isValidPassword = await user.validatePassword(password);
  if(!isValidPassword){
    throw new Error("Current password does not match");
  }
  
  if(!validateNewPassword(req)){
    throw new Error("Invalid password")
  }

  const newPass = await bcrypt.hash(newPassword,10);
  user.password = newPass;

  await user.save();
  res.send("Password updated successfully!")

  }catch(err){
    res.status(400).send("ERROR: " + err.message);
  }
})

module.exports = profileRouter 