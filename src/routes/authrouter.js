const express =require("express");
const {Register,Login,Logout,Forgotpassword,Resetpassword}=require("../controller/authcontroller")
const authRouter = express.Router();

authRouter.post("/register",Register);
authRouter.post("/login",Login);
authRouter.post("/logout",Logout);
authRouter.post("/forgotpassword",Forgotpassword);
authRouter.post("/resetpassword/:token",Resetpassword);


module.exports=authRouter