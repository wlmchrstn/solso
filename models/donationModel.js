const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        default: null,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },
}, {
    timestamps: { currentTime: () => Math.floor(Date.now()) },
});

var Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
