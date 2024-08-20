const mongoose = require('mongoose');

const kycUpdateHistorySchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    timestamp: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true },
    oldKycStatus: { type: String, enum: ['verified', 'pending', 'rejected', 'verifyKyc'], required: true },
    newKycStatus: { type: String, enum: ['verified', 'pending', 'rejected', 'verifyKyc'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('KycUpdateHistory', kycUpdateHistorySchema);
