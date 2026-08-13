const validator = require("validator");

const validateRegisterData = (req) => {
    const { emailId, password, age } = req.body;

    if (!emailId) {
        throw new Error("Email is required");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }

    if (!password) {
        throw new Error("Password is required");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }

    if (!age) {
        throw new Error("Age is required");
    }

    if (Number(age) <= 18) {
        throw new Error("Age must be above 18");
    }
};

module.exports = { validateRegisterData };