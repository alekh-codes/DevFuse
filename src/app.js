const express = require("express")
require("dotenv").config();
const app = express();
const connectDB = require("./config/database")
const User = require("./models/User")

app.post("/signup", async (req,res)=>{
    const user = new User({
        firstName:"fgdfg",
        lastName:"fdgdfgl",
        emailId:"dgfdgdf@example.com",
        password:"fdgdfl@123",
        age:45,
        gender:"Male"
    })

    try{
        await user.save();
        res.send("User data added successfully")
    }catch(err){
        res.status(400).send("Error in saving data: " + err.message);
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


