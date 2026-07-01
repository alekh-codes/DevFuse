const express = require("express")

const app = express();

app.get('/user',(req,res)=>{
    console.log(req.query);
    
    res.send({firstName:"Alekh",lastName:"thakur"})
})


// app.get("/user",(req,res)=>{
//     res.send({firstName:"Alekh",lastName:"thakur"})
// })

// app.post("/user",(req,res)=>{
//     res.send("data saved successfully to DB")
// })

// app.delete("/user",(req,res)=>{
//     res.send("Data deleted successfully from DB")

// })

// app.put("/user",(req,res)=>{
//     res.send("Data updated successfully in the DB")
// })







app.listen(3000,()=>{
    console.log("Server running on PORT 3000");
    
})