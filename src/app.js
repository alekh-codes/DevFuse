const express = require("express")
const {adminAuth,userAuth} = require("./middlewares/auth")

const app = express();
app.get('/',(req,res)=>{
    res.send("Hello from node.js")
})

//Handle Auth midleware for type of Requests

app.use("/admin",adminAuth)

app.use("/user",userAuth);

app.use("/user/data",(req,res)=>{
    res.send("User data sent")
})

app.get("/admin/allUserData",(req,res)=>{
    res.send("Get all user data")
})
app.get("/admin/deleteData",(req,res)=>{
   res.send("Deleted a user")
})

const PORT =3000
app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`);
    
})