const Donation = require('../models/donationModel');
const Event = require('../models/eventModel');
const EventDonation = require('../models/transactionEventDonationModel');
const { success, error } = require('../helpers/response');

module.exports = {
    async createDonation(req, res) {
        try {
            let donation = await Donation.create({
                name: req.body.name,
                date: req.body.date,
                cost: req.body.cost,
                event: req.params.event,
                creator: req.decoded._id
            });
            let result = {
                _id: donation._id,
                name: donation.name,
                date: donation.date,
                cost: donation.cost,
                event: donation.event,
                creator: donation.creator
            };
            if (req.params.event) {
                let isValid = await Event.findById(req.params.event);
                console.log(isValid);
                if (isValid.creator == req.decoded._id) {
                    await Event.findByIdAndUpdate(req.params.event, {
                        donation: donation._id
                    }, { new: true });
                } else {
                    res.status(403).json(error('Not authorized!', '-', 403));
                };
            }
            res.status(201).json(success('Donation created!', result));
        } catch(err) {
            res.status(400).json(error('Failed to create Donation', err.message, 400));
        };
    },
    
    async updateDonation(req, res) {
        try {
            let isValid = await Donation.findById(req.params.id);
            if (isValid.creator == req.decoded._id) {
                let donation = await Donation.findByIdAndUpdate(req.params.id, {
                    name: req.body.name,
                    date: req.body.date,
                    cost: req.body.cost,
                });
                let result = {
                    name: donation.name,
                    date: donation.date,
                    cost: donation.cost,
                };
                res.status(200).json(success('Donation updated!', result));
            } else {
                res.status(403).json(error('Not authorized!', '-', 403));
            };
        } catch(err) {
            res.status(400).json(error('Failed to update donation!', err.message, 400));
        };
    },
    
    async deleteDonation(req, res) {
        try {
            let isValid = await Donation.findById(req.params.id);
            if (isValid.creator == req.decoded._id) {
                let donation = await Donation.findByIdAndDelete(req.params.id);
                res.status(200).json(success('Donation deleted!', donation));
            } else {
                res.status(403).json(error('Not authorized!', '-', 403));
            }
        } catch(err) {
            res.status(400).json(error('Failed to delete Donation!', err.message,400));
        }
    },

    async payDonation(req, res) {
        try {
            let donation = await Donation.findById(req.params.id);
            let eventDonation = await EventDonation.create({
                event: donation.event,
                donation: donation._id,
                member: req.decoded._id,
                date: Math.floor(Date.now()),
            });
            const result = {
                _id: eventDonation._id,
                event: eventDonation.event,
                donation: eventDonation.donation,
                member: eventDonation.member,
                date: eventDonation.date,
            };
            res.status(201).json(success('Donation paid!', result));
        } catch(err) {
            res.status(400).json(error('Failed to pay donation', err.message, 400));
        };
    },

    async getAllDonationPayment(req, res) {
        try {
            let donation = EventDonation.find({ donation: req.params.id });
            res.status(200).json(success('Show all donation transaction', donation));
        } catch(err) {
            res.status(400).json(error('Failed to retrieve all donation transaction'));
        };
    },

    async getAllEventDonation(req, res) {
        try {
            let event = EventDonation.find({ event: req.params.id });
            res.status(200).json(success('Show all donation transaction', event));
        } catch(err) {
            res.status(400).json(error('Failed to retrieve all event transaction'));
        };
    },

    
}