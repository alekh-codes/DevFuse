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
        default:"https://www.google.com/imgres?q=user%20image&imgurl=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2023%2F02%2F18%2F11%2F00%2Ficon-7797704_640.png&imgrefurl=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Ficon%2520user%2F&docid=dMuvbycXQQi8uM&tbnid=IEMGLHTGr2n8wM&vet=12ahUKEwiMgNLtq8eVAxWV1zgGHQtjCn8QnPAOegUImQEQAA..i&w=640&h=640&hcb=2&ved=2ahUKEwiMgNLtq8eVAxWV1zgGHQtjCn8QnPAOegUImQEQAA",
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