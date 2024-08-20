const jwt = require('jsonwebtoken');

const authenticateAdminToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ success: false, message: "Invalid token." });
    }
};

module.exports = authenticateAdminToken;