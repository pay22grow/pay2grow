const mongoose = require("mongoose");

const adminDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, 'Please fill a valid email address'], trim: true },
    phoneNumber: { type: Number, required: true, validate: { validator: function(v) { return /\d{10}/.test(v); }, message: props => `${props.value} is not a valid 10 digit phone number!` }},
    password: { type: String, required: true, minlength: 6 },
    status: { 
        type: String, 
        enum: ['Active', 'Inactive', 'Blocked'], 
        default: 'Inactive' 
    },
    transactionsHandled : {
        type: Number,
        required: false,
        default: 0
    },
    pointsHandled: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("AdminDetails", adminDetailsSchema);
