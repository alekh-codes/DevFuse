const adminAuth = (req,res,next)=>{
    console.log("Admin auth is getting checked");
    
    const token = "xyffffz";
    const isAuthorized = token === "xyz";
    if(!isAuthorized){
        res.status(401).send("Unauthorized access")
    }
    else{
        next();
    }
}

const userAuth = (req,res,next) =>{
    console.log("User auth is getting checked");
    const token = "xyz"
    const isAuthorized = token === "xyz";
    if(!isAuthorized){
        res.status(401).send("Unauthorized accesss")
    }
    else{
        next();
    }
    
}

module.exports = {
    adminAuth,
    userAuth
}