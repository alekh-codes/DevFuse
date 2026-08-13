const express = require("express")
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignup } = require("../utils/validation");
const SAFE_USER_DATA = "firstName lastName emailId imagUrl gender age skills about";

authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignup(req);

    const { firstName, lastName, emailId, password,age,gender,skills } = req.body;
    //Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    //Create a new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      skills
    });

    await user.save();
    res.send("User data added successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId })
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const token = await user.getJWT();

      res.cookie("token", token,{expires: new Date(Date.now() + 9000000) });

      const safeData = await User.findById(user._id).select(SAFE_USER_DATA);
      res.json({message:"Login successfull",
        safeData
      })
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Invalid credentials");
  }
});

authRouter.post("/logout",(req,res)=>{
  res.cookie("token",null,{
    expires: new Date(Date.now())
  })
  res.send("Logout successful")
})
module.exports = authRouter