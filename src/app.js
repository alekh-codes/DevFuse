const express = require("express")
require("dotenv").config();
const app = express();
const connectDB = require("./config/database")
const User = require("./models/User")

app.use(express.json());

// Add user to database
app.post("/signup", async (req,res)=>{
      
    //Create a new instance of User model
    const user = new User(req.body)

    try{
        await user.save();
        res.send("User data added successfully")
    }catch(err){
        res.status(400).send("Error in saving data: " + err.message);
    }
})

//Get user by id
app.get("/user", async (req,res)=>{
    const id = req.body.id;
    try{
        const user = await User.findById(id);
        if(!user){
            res.status(404).send("User not found")
        }
        else{
            res.send(user);
        }
    }
    catch(err){
        res.status(404).send("Somethig went wrong")
    }
})

//Get user by email
app.get("/user",async (req,res)=>{
    const email = req.body.emailId;
    try{
        const user = await User.findOne({emailId:email})
        if(!user){
            res.status(400).send("User not found")   
        }else{
            res.send(user);
        }
        
    //     const user = await User.find({emailId : email})
    //     if(user.length ===0){
    //         res.status(400).send("User not found");
    //     }
    //     else{
    //         res.send(user);
    //     }
    }catch(err){
        res.status(404).send("Something wnent wrong")
    }
})

//Get all the users
app.get("/feed",async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(400).send("Something went wrong")
    }
})

//Delete a user
app.delete("/user",async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId)
        res.send("User deleted successfully")
    }catch(err){
        res.send("Something went wrong");
    }
})

app.patch("/user", async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        await User.findByIdAndUpdate(userId,data,{runValidators:true});
        res.send("User updated successfully!");
    }catch(err){
        res.send("Update failed: " + err.message)
    }
})

connectDB()
.then(()=>{
    console.log("Database connected successfully");
    app.listen(3000,()=>{
    console.log("Server listening on PORT 3000"); 
})   
})
.catch((err)=>{
    console.log("Cannot connect to database");
    
})


