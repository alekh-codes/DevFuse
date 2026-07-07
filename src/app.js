const express = require("express")
require("dotenv").config();
const app = express();
const connectDB = require("./config/database")
const User = require("./models/User")

app.use(express.json());
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

app.get("/feed",async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(400).send("Something went wrong")
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


