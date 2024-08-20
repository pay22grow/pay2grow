const mongoose = require('mongoose');

const bankUpdateHistorySchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    timestamp: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true },
    oldBankDetails: {
        accNo: { type: Number },
        ifscCode: { type: String },
        branch: { type: String },
        payeeName: { type: String }
    },
    newBankDetails: {
        accNo: { type: Number },
        ifscCode: { type: String },
        branch: { type: String },
        payeeName: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('BankUpdateHistory', bankUpdateHistorySchema);
