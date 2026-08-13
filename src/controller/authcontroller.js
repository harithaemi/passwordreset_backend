const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const { validateRegisterData } = require("../utils/errorhandler");
const User = require("../models/auth");
const sendEmail = require("../middleware/sendEmail");




const Register = async (req, res) => {
    try {
        validateRegisterData(req);

        const { emailId, password, age } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            emailId,
            password: hashedPassword,
            age
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User added successfully"
        });

    } catch (err) {
        console.log(err);

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};




const Login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("Invalid email");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.SECRET_TOKEN
        );

    res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (err) {
        console.log(err);

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};




const Logout = async (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now())
    });

    res.send("logout successful");
};




const Forgotpassword = async (req, res) => {
    try {
        const { emailId } = req.body;

        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("User does not exist");
        }

        const resetToken = user.createPasswordResetToken();

        await user.save({ validateBeforeSave: false });

        const resetPasswordURL =
            `https://authpasswordreset.netlify.app/resetpassword/${resetToken}`;

        const message =
            `Reset your password using this link below:\n\n` +
            `${resetPasswordURL}\n\n` +
            `The link expires in 15 minutes.`;

        await sendEmail({
            email: user.emailId,
            subject: "Password reset request",
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.emailId} successfully`
        });

    } catch (err) {
        console.log(err);

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};



const Resetpassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or reset code expired"
            });
        }

        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};



module.exports = {
    Register,
    Login,
    Logout,
    Forgotpassword,
    Resetpassword
};