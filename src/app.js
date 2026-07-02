const express = require("express")

const app = express();

app.get('/user',
    [(req,res,next)=>{    
    
    console.log("Handling the route handler 1");    
    // res.send("Response 1")
    next();
},(req,res,next)=>{
    console.log("Handling the route handler 2");
    // res.send("Response 2")
    next();
    
}],
(req,res,next)=>{
    console.log("Handling the route handler 3");
    // res.send("Response 3")
    next();
    
},(req,res,next)=>{
    console.log("Handling the route handler 3");
    // res.send("Response 3")
    next();
    
},(req,res,next)=>{
    console.log("Handling the route handler 4");
    // res.send("Response 4")
    next();
    
},(req,res,next)=>{
    console.log("Handling the route handler 5");
    res.send("Response 5")
    // next();
    
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