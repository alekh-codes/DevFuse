const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./config/database");
const User = require("./models/User");
const { validateSignup } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

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
app.post("/login",async (req,res)=>{
    try{
        const {emailId, password} = req.body;

    const user = await User.findOne({emailId});
    if(!user){
        throw new Error("Invalid credentials")
    }
    const isValidPassword = await bcrypt.compare(password,user.password);
    if(isValidPassword){
        res.send("Login successfull");
    }
    else{
        throw new Error("Invalid credentials")
    }
    } catch (err) {
        res.status(400).send("Invalid credentials");
    }
})

//Get user by id
app.get("/user", async (req, res) => {
  const id = req.body.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(404).send("Somethig went wrong");
  }
});

//Get user by email
app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: email });
    if (!user) {
      res.status(400).send("User not found");
    } else {
      res.send(user);
    }

    //     const user = await User.find({emailId : email})
    //     if(user.length ===0){
    //         res.status(400).send("User not found");
    //     }
    //     else{
    //         res.send(user);
    //     }
  } catch (err) {
    res.status(404).send("Something wnent wrong");
  }
});

//Get all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const AllowedUpdates = ["age", "skills", "about", "gender"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      AllowedUpdates.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await User.findByIdAndUpdate(userId, data, { runValidators: true });
    res.send("User updated successfully!");
  } catch (err) {
    res.send("Update failed: " + err.message);
  }
});

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
