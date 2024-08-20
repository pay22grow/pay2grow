const mongoose = require("mongoose");

const rechargeSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UseCredentials',
        required: true
    },
    userInfo: {
        name : {type: String, required: true},
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
    },
    userDbId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails',
        required: true
    },
    buyPoints: {
        type: Number,
        required: true
    },
    receivePoints: {
        type: Number,
        required: true
    },
    needToPayUSDT: {
        type: Number,
        required: true
    },
    profit: {
        type: Number,
        required: true
    },
    rechargeProof: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved/waiting withdraw', 'withdraw success', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    buyPrice: {
        type: Number,
        required: false,
    },
    sellPrice: {
        type: Number,
        required: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("Recharge", rechargeSchema);
