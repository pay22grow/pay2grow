const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, 'Please fill a valid email address'], trim: true },
    phoneNumber: { 
        type: Number, 
        required: true, 
        validate: { 
            validator: function(v) { return /\d{10}/.test(v); }, 
            message: props => `${props.value} is not a valid 10 digit phone number!` 
        }
    },
    password: { type: String, required: true, minlength: 6 },
    uniqueInvitationCode: { type: String, unique: true }, 
    enteredInvitationCode: { type: String, trim: true },  
    kyc: {
        type: String, 
        required: false
    },
    balance: {
        type: Number,
        required: true
    },
    pending: {
        type: Number,
        required: true
    },
    bankDetails : { 
        accNo : {type : Number, required: false},
        ifscCode: {type: String, required: false},
        branch: { type: String, required: false},
        payeeName : { type: String, required: false}
    },
    status: { 
        type: String, 
        enum: ['Active', 'Inactive', 'Blocked'], 
        default: 'Inactive' 
    },
    kycVerified: { 
        type: String,
        enum: ['verified', 'pending', 'rejected', 'verifyKyc'], 
        required: false,
        default: 'verifyKyc' 
    },
    bankUpdateRequest: {
        type: String,
        enum: ['approved', 'uploadBankDetails', 'pending', 'rejected'],
        required: false,
        defaut: 'uploadBankDetails'
    }
}, { timestamps: true });

module.exports = mongoose.model("UserDetails", userDetailsSchema);

