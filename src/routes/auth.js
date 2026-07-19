const express = require("express")
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignup } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignup(req);

    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    //Create a new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
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

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const token = await user.getJWT();

      res.cookie("token", token,{expires: new Date(Date.now() + 9000000) });

      res.send("Login successfull");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Invalid credentials");
  }
});