const mongoose = require('mongoose');

const memberEventSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    },
    date: {
        type: Date,
        required: true,
    },
}, {
    timestamps: { currentTime: () => Math.floor(Date.now()) },
});

var MemberEvent = mongoose.model('MemberEvent', memberEventSchema);

module.exports = MemberEvent;
