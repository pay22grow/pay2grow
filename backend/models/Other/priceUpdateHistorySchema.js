const mongoose = require("mongoose");

const priceUpdateHistorySchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminDetails',
        required: true
    },
    updatedData: {
        todaysRate: {
            type: Number,
            required: true
        },
        wazirXRate: {
            type: Number,
            required: true
        },
        binanceRate: {
            type: Number,
            required: true
        },
        kuCoinRate: {
            type: Number,
            required: true
        },
        todaysBuyPrice: {
            type: Number,
            required: true
        },
        todaysSellPrice: {
            type: Number,
            required: true
        }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("PriceUpdateHistory", priceUpdateHistorySchema);
