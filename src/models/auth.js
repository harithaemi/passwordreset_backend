const mongoose = require("mongoose");
const crypto = require("crypto");


const userSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    age: {
      type: Number,
      min: 18
    },

    resetPasswordToken: String,

    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};



module.exports = mongoose.model("User", userSchema);