const express = require("express");
const router = express.Router();
const AdminCredentials = require("../../models/Admin/adminCredentials");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.ADMIN_JWT_SECRET;
const SALT_ROUNDS = 10;

router.post('/login', async (req, res) => {
    const { email, phoneNumber, password} = req.body;

    try {
        let admin = null;

        if (email) {
            admin = await AdminCredentials.findOne({ email });
        } else if (phoneNumber) {
            admin = await AdminCredentials.findOne({ phoneNumber });
        }

        if (!admin) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { adminId: admin._id, email: admin.email, phoneNumber: admin.phoneNumber,adminDbId: admin.adminDbId },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.status(200).json({ success: true, message: "Login successful", token});

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

module.exports = router;
