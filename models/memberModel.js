const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const memberSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    profilePic: {
        type: String,
        default: 'https://res.cloudinary.com/ayumhrn/image/upload/v1569487841/fo1jogrqffevwvulwkyo.png',
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    token: {
        type: String,
        required: false
    },
}, {
    timestamps: { currentTime: () => Math.floor(Date.now()) },
});

memberSchema.plugin(uniqueValidator);
var Member = mongoose.model('Member', memberSchema);

module.exports = Member;
