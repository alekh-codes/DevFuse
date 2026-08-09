const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors")

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestsRouter = require("./routes/requests")
const userRouter = require("./routes/user")

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestsRouter)
app.use("/",userRouter)

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server listening on PORT 3000");
    });
  })
  .catch((err) => {
    console.log("Cannot connect to database");
  });
