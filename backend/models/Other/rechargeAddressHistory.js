const mongoose = require('mongoose');

const rechargeAddressHistorySchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminDetails', 
    required: true
  },
  adminInfo: {
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  address: {
    type: String,
    required: true
  },
  image: {
    type: String, 
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true });

module.exports = mongoose.model('RechargeAddressHistory', rechargeAddressHistorySchema);
