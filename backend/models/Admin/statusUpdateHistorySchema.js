const mongoose = require('mongoose');

const statusUpdateHistorySchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    timestamp: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true },
    oldStatus: { type: String, enum: ['Active', 'Inactive', 'Blocked'], required: true },
    newStatus: { type: String, enum: ['Active', 'Inactive', 'Blocked'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('StatusUpdateHistory', statusUpdateHistorySchema);
