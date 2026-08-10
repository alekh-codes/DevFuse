const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName :{
        type:String,
    },
    emailId :{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password")
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","others"],
            message: `{VALUE} is not a valid gender`

        }
    },
    about:{
        type:String,
        default:"This is a default about page"
    },
    imagUrl:{
        type:String,
        default:"https://portfolio-one-kappa-15.vercel.app/assets/main-DnCC98cz.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Url: " , value)
            }
        }
        
    },
    skills:{
        type:Array,
    }
},{
    timestamps:true
})

userSchema.methods.getJWT = async function(){
    const user = this;

    const token = jwt.sign({ _id: user._id }, "DevFuse$02$@11", {expiresIn : "1d"});

    return token;
}

userSchema.methods.validatePassword = async function(passwordByInput){
    const user  = this;
    const hashPassword = user.password

    const isValidPassword = await bcrypt.compare(passwordByInput, hashPassword);

    return isValidPassword;
}

module.exports = mongoose.model("User",userSchema);