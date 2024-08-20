const express = require('express');
const mongoose = require('mongoose');
const RechargeAddress = require('../../models/Other/rechargeAddress'); 
const RechargeAddressHistory = require('../../models/Other/rechargeAddressHistory'); 
const authenticateAdminToken = require('../../middlewares/authAdminMiddleware');
const router = express.Router();

// Middleware to ensure single entry in RechargeAddress
const ensureSingleEntry = async (req, res, next) => {
  try {
    const count = await RechargeAddress.countDocuments();
    if (count > 1) {
      return res.status(500).json({ message: 'There should be only one entry in RechargeAddress' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get current recharge address
router.get('/recharge-address', async (req, res) => {
  try {
    const address = await RechargeAddress.findOne();
    if (!address) {
      return res.status(404).json({ message: 'Recharge address not found' });
    }
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update recharge address
router.put('/recharge-address', authenticateAdminToken, ensureSingleEntry, async (req, res) => {
  const { address, image } = req.body;
  const adminId = req.admin.adminId;

  try {
    let currentAddress = await RechargeAddress.findOne();
    
    if (!currentAddress) {
      // Create the address if it does not exist
      currentAddress = await RechargeAddress.create({ address, image });
    } else {
      // Save update history
      await RechargeAddressHistory.create({
        adminId,
        adminInfo: {
          email: req.admin.email,
          phoneNumber: req.admin.phoneNumber
        },
        address: currentAddress.address,
        image: currentAddress.image,
        updatedAt: new Date(),
      });

      // Update address
      currentAddress.address = address;
      currentAddress.image = image;
      await currentAddress.save();
    }

    res.json(currentAddress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get address update history
router.get('/recharge-address-history', authenticateAdminToken, async (req, res) => {
  try {
    const history = await RechargeAddressHistory.find().populate('adminId').sort({ updatedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
