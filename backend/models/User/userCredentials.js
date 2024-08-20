const mongoose = require("mongoose");

const userCredentialsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid 10 digit phone number!`
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    userDbId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails',  
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("UserCredentials", userCredentialsSchema);
