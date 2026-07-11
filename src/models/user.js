const mongoose = require("mongoose")
const validator = require("validator")

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
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid");
            }
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

module.exports = mongoose.model("User",userSchema);