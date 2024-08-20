const mongoose = require('mongoose');

const rechargeAddressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String, 
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('RechargeAddress', rechargeAddressSchema);
