const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Upcoming', 'Ongoing', 'Finished'],
        default: 'Upcoming',
    },
    description: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        required: false,
        default: 'https://res.cloudinary.com/ayumhrn/image/upload/v1569487841/fo1jogrqffevwvulwkyo.png',
    },
    donation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
        default: null,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },
}, {
    timestamps: { currentTime: () => Math.floor(Date.now()) },
});

eventSchema.plugin(uniqueValidator);
var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
