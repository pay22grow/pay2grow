const express = require("express");
const router = express.Router();
const User = require("../../models/User/userDetails");
const InviteTracking = require("../../models/Other/inviteTrackingSchema");
const bcrypt = require("bcrypt");
const fetch = require('node-fetch');   
const SALT_ROUNDS = 10;
const BankDetailsUpdateHistory = require("../../models/Other/bankDetailsUpdateHistorySchema");
const authenticateToken = require('../../middlewares/authMiddleware');
const userCredentials = require("../../models/User/userCredentials");
const generateInviteCode = () => {
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    const randomAlphabets = Array.from({ length: 3 }, () => alphabets[Math.floor(Math.random() * alphabets.length)]).join('');
    const randomNumbers = Array.from({ length: 2 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('');

    return randomAlphabets + randomNumbers;
};

router.post("/signup", async (req, res) => {
    const { name, email, phoneNumber, password, enteredInvitationCode = ""} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        const existingPhoneNumber = await User.findOne({ phoneNumber });
        if (existingUser || existingPhoneNumber) {
            return res.status(400).json({ message: "User already exists" });
        }

        let uniqueInvitationCode;
        let isUnique = false;
        while (!isUnique) {
            uniqueInvitationCode = generateInviteCode();
            const existingCode = await InviteTracking.findOne({ uniqueInvitationCode });
            if (!existingCode) isUnique = true;
        }

        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            uniqueInvitationCode,
            enteredInvitationCode: "",
            balance: 0,
            pending: 0,
            bankUpdateRequest : "uploadBankDetails",
        });

        let storedEnteredInvitationCode = enteredInvitationCode.trim();
        if (storedEnteredInvitationCode) {
            const inviteTracking = await InviteTracking.findOne({ uniqueInvitationCode: storedEnteredInvitationCode });
            if (inviteTracking) {
                await user.save();
                inviteTracking.invites.push(user._id);
                await inviteTracking.save();
                user.enteredInvitationCode = storedEnteredInvitationCode;
                await user.save();
            } else {
                storedEnteredInvitationCode = "";
            }
        } else {
            await user.save();
        }


        await InviteTracking.create({
            uniqueInvitationCode,
            invitationCodeOwnerId: user._id,
            invites: []
        });

        const userCredentialsPayload = {
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            userDbId: user._id
        };
        const baseApiUrl = process.env.BASE_API_URL;
        const response = await fetch(`${baseApiUrl}/user/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userCredentialsPayload),
        });

        if (!response.ok) {
            return res.status(response.status).json({ message: "Failed to register user credentials" });
        }

        const credentialsData = await response.json();
        res.status(201).json({ message: "User created successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/updatePending", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userDbId;
        const { receivePoints } = req.body;

        if (receivePoints == null) {
            return res.status(400).json({ success: false, message: "Receive points are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update the pending field
        user.pending = (user.pending || 0) + receivePoints;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Pending points updated successfully",
            user
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/updateKyc", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userDbId;  
        const { kyc, kycVerified } = req.body;
        if (!kyc) {
            return res.status(400).json({ success: false, message: "KYC image is required" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        user.kyc = kyc;
        user.kycVerified = kycVerified; 
        await user.save();

        res.status(200).json({
            success: true,
            message: "KYC information updated successfully",
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
router.post("/updateBankDetails", authenticateToken, async (req, res)=>{
    try{
        const userId = req.user.userDbId;
        const { bankDetails } = req.body;
        if(!bankDetails){
            return res.status(400).json({success: false, message: "Bank Details are required"});
        }
        if (!bankDetails.accNo || !bankDetails.ifscCode || !bankDetails.branch || !bankDetails.payeeName) {
            return res.status(400).json({ success: false, message: "Please fill out all fields." });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        user.bankDetails = bankDetails;
        user.bankUpdateRequest = "pending";
        await user.save();
        const historyEntry = await BankDetailsUpdateHistory.findOne({ userId });
        if (historyEntry) {
            historyEntry.updates.push({
                accNo: bankDetails.accNo,
                ifscCode: bankDetails.ifscCode,
                branch: bankDetails.branch,
                payeeName: bankDetails.payeeName,
                updatedAt: Date.now()
            });
            await historyEntry.save();
        } else {
            await BankDetailsUpdateHistory.create({
                userId,
                updates: [{
                    accNo: bankDetails.accNo,
                    ifscCode: bankDetails.ifscCode,
                    branch: bankDetails.branch,
                    payeeName: bankDetails.payeeName,
                    updatedAt: Date.now()
                }]
            });
        }
        res.status(200).json({
            success: true, 
            message:"Bank details updated successfully",
        });
    }catch(err){
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/getDetails", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userDbId;
        let user = await User.findById(userId); 
        if (!user) {
            return res.status(400).json({ success: false, message: "User details not found" });
        }
        res.json({ 
            success: true,
            message: "User Details Found!",
            user : {
                status : user.status,
                kycVerified : user.kycVerified,
                bankUpdateRequest : user.bankUpdateRequest,
                _id : user._id
            },
        });
    } catch (err) {
        console.error("Error:", err); 
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/getDetailsHome", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userDbId;
        let user = await User.findById(userId); 
        if (!user) {
            return res.status(400).json({ success: false, message: "User details not found" });
        }
        res.json({ 
            success: true,
            message: "User Details Found!",
            user : {
                balance: user.balance,
                pending: user.pending
            },
        });
    } catch (err) {
        console.error("Error:", err); 
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/getDetailsHeader", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userDbId;
        let user = await User.findById(userId); 
        if (!user) {
            return res.status(400).json({ success: false, message: "User details not found" });
        }
        res.json({ 
            success: true,
            message: "User Details Found!",
            user : {
                name: user.name
            },
        });
    } catch (err) {
        console.error("Error:", err); 
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/getDetailsProfile", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userDbId;
        let user = await User.findById(userId); 
        if (!user) {
            return res.status(400).json({ success: false, message: "User details not found" });
        }
        res.json({ 
            success: true,
            message: "User Details Found!",
            user : {
                name: user.name,
                balance: user.balance,
                status: user.status,
                phoneNumber: user.phoneNumber,
                email: user.email,
                uniqueInvitationCode: user.uniqueInvitationCode,
                kycVerified: user.kycVerified,
                kyc: user.kyc,
                bankDetails: user.bankDetails,
                bankUpdateRequest: user.bankUpdateRequest,
                _id : user._id,
            },
        });
    } catch (err) {
        console.error("Error:", err); 
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});



router.get("/getAllDetails", async (req, res) => {
    try {
        let users = await User.find({});
        if (!users || users.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No Users Found",
            });
        }
        res.json({
            success: true,
            message: "All User Details Found!",
            users,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
