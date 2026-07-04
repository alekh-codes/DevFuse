const express = require("express")


const app = express();



const m1 = (req, res, next) => {
    console.log("M1");
    next();
};

const m2 = (req, res, next) => {
    console.log("M2");
    next();
};

const m3 = (req, res, next) => {
    console.log("M3");
    next(new Error("end of stack"))

};

const errorHandle = (err,req,res,next)=>{
    res.status(500).send(err.message)
}


app.get("/", m1, m2, m3);
app.use(errorHandle)

const PORT =3000
app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`);
    
})