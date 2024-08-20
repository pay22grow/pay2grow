const mongoose = require("mongoose");

const setPricesSchema = new mongoose.Schema({
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
}, { timestamps: true });

module.exports = mongoose.model("SetPrices", setPricesSchema);

