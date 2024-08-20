const express = require("express");
const router = express.Router();
const UserCredentials = require("../../models/User/userCredentials"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userDetails = require("../../models/User/userDetails");

const SECRET_KEY = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
    const { name, email, phoneNumber, password, userDbId } = req.body;

    try {
        const existingUser = await UserCredentials.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        const existingPhoneNumber = await UserCredentials.findOne({ phoneNumber });
        if (existingPhoneNumber) {
            return res.status(400).json({
                success: false,
                message: "User with this phone number already exists",
            });
        }

        const user = await UserCredentials.create({
            name,
            email,
            phoneNumber,
            password: password,
            userDbId  
        });
        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                id: user._id,
                userDbId: user.userDbId,
                password: password,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, phoneNumber, password } = req.body;

    try {
        let user = null;
        let userD = null;
        if (email) {
            user = await UserCredentials.findOne({ email });
            userD = await userDetails.findOne({email});
        } else if (phoneNumber) {
            user = await UserCredentials.findOne({ phoneNumber: parseInt(phoneNumber, 10) });
            userD = await userDetails.findOne({phoneNumber: parseInt(phoneNumber, 10)});
        }
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, userDbId: user.userDbId },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.status(200).json({ success: true, message: "Login successful", token });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

module.exports = router;
