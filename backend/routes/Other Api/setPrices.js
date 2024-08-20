
const express = require("express");
const router = express.Router();
const SetPrices = require("../../models/Other/setPricesSchema");
const PriceUpdateHistory = require("../../models/Other/priceUpdateHistorySchema");
const authenticateAdminToken = require("../../middlewares/authAdminMiddleware");

router.post("/setPrices", authenticateAdminToken, async (req, res) => {
    const { todaysRate, wazirXRate, binanceRate, kuCoinRate, todaysBuyPrice, todaysSellPrice } = req.body;
    const adminId = req.admin.adminId;

    try {
        const existingPrice = await SetPrices.findOne();
        
        if (existingPrice) {
            existingPrice.todaysRate = todaysRate;
            existingPrice.wazirXRate = wazirXRate;
            existingPrice.binanceRate = binanceRate;
            existingPrice.kuCoinRate = kuCoinRate;
            existingPrice.todaysBuyPrice = todaysBuyPrice;
            existingPrice.todaysSellPrice = todaysSellPrice;
            await existingPrice.save();
        }
        
        const priceUpdateHistory = new PriceUpdateHistory({
            adminId,
            updatedData: {
                todaysRate,
                wazirXRate,
                binanceRate,
                kuCoinRate,
                todaysBuyPrice,
                todaysSellPrice
            }
        });
        await priceUpdateHistory.save();

        res.status(200).json({ message: "Prices updated successfully", setPrices: existingPrice || newPrice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to get current prices
router.get("/getPrices", async (req, res) => {
    try {
        const setPrices = await SetPrices.findOne();
        if (!setPrices) {
            return res.status(404).json({ message: "No price data found" });
        }
        res.json({ setPrices });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;