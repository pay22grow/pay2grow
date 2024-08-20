const mongoose = require('mongoose');

const rechargeUpdateHistorySchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', 
    required: true
  },
  rechargeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recharge',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  previousState: {
    type: String,
    enum: ['pending', 'approved/waiting withdraw', 'withdraw success', 'rejected'],
    required: true
  },
  updatedState: {
    type: String,
    enum: ['pending', 'approved/waiting withdraw', 'withdraw success', 'rejected'],
    required: true
  },
  updateType: {
    type: String, 
    enum: ['approval', 'withdrawal', 'rejection', 'other']
  }
});

const RechargeUpdateHistory = mongoose.model('RechargeUpdateHistory', rechargeUpdateHistorySchema);

module.exports = RechargeUpdateHistory;
