const validator = require("validator")

const validateSignup = (req) => {
  const { firstName, emailId, password, age, skills } = req.body;
  if (firstName.length < 3) {
    throw new Error("Name format is invalid");
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailId)) {
    throw new Error("Email is invalid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
  if (age < 18) {
    throw new Error("You are not eligible for this platform");
  }
  
  if (skills.length > 10) {
    throw new Error("Skills cannot be more than 10");
  }
};

const validateEditData = (req) =>{
  
    const allowededit = [
    "firstName",
    "lastName",
    "about",
    "imagUrl",
    "skills",
    "gender",
    "age"
  ]

  const isAllowed = Object.keys(req.body).every(field => allowededit.includes(field))
  return isAllowed;
 
}

module.exports ={
  validateSignup,
  validateEditData
}