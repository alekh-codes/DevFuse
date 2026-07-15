const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./config/database");
const User = require("./models/User");
const { validateSignup } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
app.use(express.json());
app.use(cookieParser());

// Add user to database
app.post("/signup", async (req, res) => {
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

//Login API
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const token = await jwt.sign({ _id: user._id }, "DevFuse$02$@11", {expiresIn : "1d"});

      res.cookie("token", token);

      res.send("Login successfull");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Invalid credentials");
  }
});

//Profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.send("Error:" + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth,(req,res)=>{

  const user = req.user;
  res.send(user.firstName + ' sends the connection request');
})
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server listening on PORT 3000");
    });
  })
  .catch((err) => {
    console.log("Cannot connect to database");
  });
