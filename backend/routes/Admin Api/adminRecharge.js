const express = require('express');
const Recharge = require('../../models/Other/recharge');
const RechargeUpdateHistory = require('../../models/Other/rechargeUpdateHistorySchema'); 
const authenticateAdminToken = require('../../middlewares/authAdminMiddleware'); 
const UserDetails = require('../../models/User/userDetails');
const router = express.Router();

const saveUpdateHistory = async (adminId, rechargeId, previousState, updatedState, updateType) => {
  try {
    await RechargeUpdateHistory.create({
      adminId,
      rechargeId,
      previousState,
      updatedState,
      updateType
    });
  } catch (err) {
    console.error('Failed to save update history:', err.message);
  }
};

router.get('/stats', authenticateAdminToken, async (req, res) => {
    try {
      const adminId = req.admin.adminDbId;
      const rechargeUpdateHistory = await RechargeUpdateHistory.find({ adminId }).select('rechargeId');
      const uniqueRechargeIds = [...new Set(rechargeUpdateHistory.map(update => update.rechargeId.toString()))];
      const recharges = await Recharge.find({ _id: { $in: uniqueRechargeIds } });
  
      const totalAmountHandled = recharges.reduce((acc, recharge) => acc + recharge.receivePoints, 0);
      res.status(200).json({
        success: true,
        uniqueRechargesHandled: uniqueRechargeIds.length,
        totalAmountHandled
      });
    } catch (error) {
      console.error("Error fetching admin recharge stats:", error);
      res.status(500).json({
        success: false,
        message: 'Error fetching admin recharge stats',
        error: error.message
      });
    }
  });

router.get('/getAllRecharges', authenticateAdminToken, async (req, res) => {
    try {
        const recharges = await Recharge.find().sort({ createdAt: -1 });
        res.json({  status: true, message: "Recharges fetched successsfully",recharges });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put('/approveRecharge/:rechargeId', authenticateAdminToken, async (req, res) => {
    try {
        const adminId = req.admin.adminDbId;
        const recharge = await Recharge.findById(req.params.rechargeId);

        if (!recharge) {
            return res.status(404).json({ message: 'Recharge request not found' });
        }

        const previousState = recharge.status;
        const receivePoints = recharge.receivePoints;
        const userId = recharge.userDbId; 

        // Find user and update details
        const user = await UserDetails.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.balance += receivePoints;
        user.pending -= receivePoints;
        await user.save();
        recharge.status = 'approved/waiting withdraw';
        await recharge.save();
        await saveUpdateHistory(adminId, recharge._id, previousState, recharge.status, 'approval');

        res.json({ status: true, message: 'Recharge request approved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Withdraw a recharge request
router.put('/withdrawStatus/:rechargeId', authenticateAdminToken, async (req, res) => {
    try {
        const adminId = req.admin.adminDbId;
        const withdraw = await Recharge.findById(req.params.rechargeId);

        if (!withdraw) {
            return res.status(404).json({ message: 'Recharge request not found' });
        }

        const previousState = withdraw.status;
        const receivePoints = withdraw.receivePoints;
        const userId = withdraw.userDbId; 
        const user = await UserDetails.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.balance -= receivePoints; 
        await user.save();

        withdraw.status = 'withdraw success';
        await withdraw.save();

        await saveUpdateHistory(adminId, withdraw._id, previousState, withdraw.status, 'withdrawal');

        res.json({ message: 'Recharge withdrawn', withdraw });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reject a recharge request
router.put('/rejectRecharge/:rechargeId', authenticateAdminToken, async (req, res) => {
    try {
        const adminId = req.admin.adminDbId;
        const recharge = await Recharge.findById(req.params.rechargeId);

        if (!recharge) {
            return res.status(404).json({ message: 'Recharge request not found' });
        }

        const previousState = recharge.status;
        const receivePoints = recharge.receivePoints;
        const userId = recharge.userDbId;

        const user = await UserDetails.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.pending -= receivePoints;
        await user.save();
        recharge.status = 'rejected';
        await recharge.save();
        await saveUpdateHistory(adminId, recharge._id, previousState, recharge.status, 'rejection');

        res.json({ message: 'Recharge request rejected', recharge });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;