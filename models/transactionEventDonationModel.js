const mongoose = require('mongoose');

const eventDonationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },
    donation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },
    date: {
        type: Date,
        required: true,
    },
}, {
    timestamps: { currentTime: () => Math.floor(Date.now()) },
});

var EventDonation = mongoose.model('EventDonation', eventDonationSchema);

module.exports = EventDonation;
