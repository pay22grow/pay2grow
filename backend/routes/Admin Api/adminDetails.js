const express = require("express");
const router = express.Router();
const AdminDetails = require("../../models/Admin/adminDetails");
const AdminCredentials = require("../../models/Admin/adminCredentials");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateAdminToken = require('../../middlewares/authAdminMiddleware');
const SECRET_KEY = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;
const UserDetails = require("../../models/User/userDetails");
const StatusUpdateHistory = require('../../models/Admin/statusUpdateHistorySchema');
const BankUpdateHistory = require('../../models/Admin/bankUpdateHistorySchema');
const KycUpdateHistory = require('../../models/Admin/kycUpdateHistorySchema');
router.post("/signup", async (req, res) => {
    const { name, email, phoneNumber, password } = req.body;

    try {
        const existingAdmin = await AdminDetails.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new AdminDetails({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
        });
        await admin.save();

        const adminCredentials = new AdminCredentials({
            email,
            phoneNumber,
            password: hashedPassword,
            adminDbId: admin._id
        });
        await adminCredentials.save();
        res.status(201).json({ message: "Admin created successfully", admin });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/getDetails", async (req, res) => {
    try {
        const admin = await AdminDetails.findById(req.user.adminId);
        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }
        res.json({ admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/getDetailsHeader", authenticateAdminToken, async (req, res) => {
    try {
        const adminId = req.admin.adminDbId;
        let admin = await AdminDetails.findById(adminId); 
        if (!admin) {
            return res.status(400).json({ success: false, message: "Admin details not found" });
        }
        res.json({ 
            success: true,
            message: "Admin Details Found!",
            admin : {
                name: admin.name
            },
        });
    } catch (err) {
        console.error("Error:", err); 
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


router.post("/getDetailsProfile", authenticateAdminToken, async (req, res) => {
    try {
        const adminId = req.admin.adminDbId;
        let admin = await AdminDetails.findById(adminId); 
        if (!admin) {
            return res.status(400).json({ success: false, message: "Admin details not found" });
        }
        res.json({ 
            success: true,
            message: "Admin Details Found!",
            admin : {
                name: admin.name,
                status: admin.status,
                phoneNumber: admin.phoneNumber,
                email: admin.email,
                pointsHandled : admin.pointsHandled,
                transactionsHandled : admin.transactionsHandled,
                _id : admin._id,
            },
        });
    } catch (err) {
        console.error("Error:", err); 
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.get("/getAllUsers", authenticateAdminToken, async (req, res) => {
    try {
        const users = await UserDetails.find({}, 'name status phoneNumber email kycVerified bankUpdateRequest _id balance pending bankDetails kyc uniqueInvitationCode');

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }
        res.json({
            success: true,
            message: "Users Retrieved Successfully!",
            users: users.map(user => ({
                name: user.name,
                status: user.status,
                phoneNumber: user.phoneNumber,
                email: user.email,
                kyc: user.kyc,
                balance: user.balance,
                pending: user.pending,
                kycVerified: user.kycVerified,
                bankDetails: user.bankDetails,
                uniqueInvitationCode: user.uniqueInvitationCode,
                bankUpdateRequest: user.bankUpdateRequest,
                _id: user._id
            }))
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.put('/updateStatus/:userId', authenticateAdminToken, async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['Active', 'Inactive', 'Blocked'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    try {
        const user = await UserDetails.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const oldStatus = user.status;
        user.status = status;
        await user.save();

        
        await StatusUpdateHistory.create({
            adminId: req.admin.adminDbId,  
            userId,
            oldStatus,
            newStatus: status
        });

        res.json({
            success: true,
            message: 'User status updated successfully',
            user
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
router.get('/calculateTotals', authenticateAdminToken, async (req, res) => {
    try {
        const result = await UserDetails.aggregate([
            {
                $group: {
                    _id: null,
                    totalBalance: { $sum: "$balance" },
                    totalPending: { $sum: "$pending" }
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "No data available" });
        }

        res.json({
            success: true,
            message: "Totals calculated successfully",
            totalBalance: result[0].totalBalance,
            totalPending: result[0].totalPending
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.put('/updateBankUpdateRequest/:userId', authenticateAdminToken, async (req, res) => {
    const { userId } = req.params;
    const { bankUpdateRequest } = req.body;

    if (!['approved', 'uploadBankDetails', 'pending', 'rejected'].includes(bankUpdateRequest)) {
        return res.status(400).json({ success: false, message: 'Invalid bank update request status value' });
    }

    try {
        const user = await UserDetails.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const oldBankDetails = user.bankDetails;
        user.bankUpdateRequest = bankUpdateRequest;
        await user.save();

        await BankUpdateHistory.create({
            adminId: req.admin.adminDbId,
            userId,
            oldBankDetails,
            newBankDetails: user.bankDetails
        });

        res.json({
            success: true,
            message: 'User bank update request status updated successfully',
            user
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.put('/updateKycVerified/:userId', authenticateAdminToken, async (req, res) => {
    const { userId } = req.params;
    const { kycVerified } = req.body;

    if (!['verified', 'pending', 'rejected', 'verifyKyc'].includes(kycVerified)) {
        return res.status(400).json({ success: false, message: 'Invalid KYC verification status value' });
    }

    try {
        const user = await UserDetails.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const oldKycStatus = user.kycVerified;
        user.kycVerified = kycVerified;
        await user.save();
        await KycUpdateHistory.create({
            adminId: req.admin.adminDbId,
            userId,
            oldKycStatus,
            newKycStatus: kycVerified
        });

        res.json({
            success: true,
            message: 'User KYC verification status updated successfully',
            user
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
