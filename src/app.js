require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRouter = require("./routes/authrouter");
const cors =require("cors")
const app = express();

app.use(
  cors({
    origin:"https://authpasswordreset.netlify.app",
    credentials:true,
  })
)
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

connectDB()
  .then(() => {
    console.log("database connected");

    app.listen(3000, () => {
      console.log("server listening to 3000");
    });
  })
  .catch((err) => {
    console.log("database cannot connect", err);
  });

