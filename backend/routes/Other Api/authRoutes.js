// In your backend route file (e.g., authRoutes.js)
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;
const ADMIN_SECRET_KEY = process.env.ADMIN_JWT_SECRET;
const router = express.Router();

router.post("/validate-token", (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, message: "No token provided" });
    }

    try {
        jwt.verify(token, SECRET_KEY);
        res.status(200).json({ success: true, message: "Token is valid" });
    } catch (error) {
        res.status(401).json({ success: false, message: "Token is invalid or expired" });
    }
});
router.post("/validate-token-admin", (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, message: "No token provided" });
    }

    try {
        jwt.verify(token, ADMIN_SECRET_KEY);
        res.status(200).json({ success: true, message: "Token is valid" });
    } catch (error) {
        res.status(401).json({ success: false, message: "Token is invalid or expired" });
    }
});

module.exports = router;
