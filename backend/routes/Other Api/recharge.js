const express = require('express');
const multer = require('multer');
const Recharge = require('../../models/Other/recharge');
const UserDetails = require('../../models/User/userDetails');
const authenticateToken = require('../../middlewares/authMiddleware');

const router = express.Router();
const upload = multer();

const isPositiveNumber = (value) => !isNaN(value) && Number(value) > 0;

const throttleRequests = async (userId) => {
    // Find the most recent request for the user
    const lastRequest = await Recharge.findOne({ user_id: userId }).sort({ createdAt: -1 });

    if (!lastRequest) {
        return false;
    }
    const lastRequestTime = new Date(lastRequest.createdAt).getTime();
    const currentTime = Date.now();
    const timeDifference = currentTime - lastRequestTime;
    if (timeDifference < 30000) {
        return true;
    }

    return false;
};


router.post('/createRecharge', authenticateToken, upload.single('rechargeProof'), async (req, res) => {
    const { buyPoints, receivePoints, needToPayUSDT, profit, buyPrice, sellPrice, rechargeProof} = req.body;
    try {
        if (!buyPoints || !receivePoints || !needToPayUSDT || !profit || !buyPrice || !sellPrice) {
            return res.status(400).json({ success: false,message: 'All fields are required' });
        }

        if (!isPositiveNumber(buyPoints) || !isPositiveNumber(receivePoints) || !isPositiveNumber(needToPayUSDT) || !isPositiveNumber(profit) || !isPositiveNumber(buyPrice) ||  !isPositiveNumber(sellPrice)) {
            return res.status(400).json({ success: false,message: 'All numerical fields must be greater than 0' });
        }

        if (!rechargeProof) {
            return res.status(400).json({ success: false,message: 'Recharge proof image is required' });
        }

        const isThrottled = await throttleRequests(req.user.userId);

        if (isThrottled) {
            return res.status(429).json({success:false, message: 'Too many requests. Please try again later.' });
        }
        const newRecharge = new Recharge({
            user_id: req.user.userId,
            userInfo: {
                name : req.user.name,
                email: req.user.email,
                phoneNumber: req.user.phoneNumber
            },
            userDbId: req.user.userDbId,
            buyPoints,
            receivePoints,
            needToPayUSDT,
            profit,
            buyPrice,
            sellPrice,
            rechargeProof: rechargeProof 
        });

        await newRecharge.save();
        res.status(201).json({ success: true, message: 'Recharge request created successfully', newRecharge });
    } catch (err) {
        console.error('Error in /createRecharge:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});


router.get('/getRecharges', authenticateToken, async (req, res) => {
    try {
        const recharges = await Recharge.find({ user_id: req.user.userId });
        res.json({ status: true, message: "Recharges fetched successsfully", recharges });
    } catch (err) {
        res.status(500).json({ status: false,message: "Internal Server Error",error: err.message });
    }
});

module.exports = router;
