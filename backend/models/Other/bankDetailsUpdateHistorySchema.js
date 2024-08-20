const mongoose = require('mongoose');

const bankDetailsUpdateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails',
        required: true,
        unique: true 
    },
    updates: [{
        accNo: {
            type: String,
            required: true
        },
        ifscCode: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        payeeName: {
            type: String,
            required: true
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('BankDetailsUpdateHistory', bankDetailsUpdateSchema);
