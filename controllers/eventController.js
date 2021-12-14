const Event = require('../models/eventModel');
const MemberEvent = require('../models/transactionMemberEventModel');
const { success, error } = require('../helpers/response');
const multer = require('multer');
const datauri = require('datauri');
const cron = require('node-cron');

const cloudinary = require('cloudinary').v2;
const uploader = multer().single('image');

cron.schedule('0 0 1 * * *', () => {
    Event.find({ status: 'Upcoming' })
        .then(res => {
            res.forEach(i => {
                let tanggal = i.date.getDate()
                let today = new Date().getDate();
                if (tanggal == today) {
                    Event.findByIdAndUpdate(i._id, {
                        status: 'Ongoing',
                    })
                } else if (tanggal <= today) {
                    Event.findByIdAndUpdate(i._id, {
                        status: 'Finished',
                    });
                };
            });
        })
});

cron.schedule('0 0 0 * * *', () => {
    Event.find({ status: 'Ongoing' })
        .then(res => {
            res.forEach(i => {
                let tanggal = i.date.getDate()
                let today = new Date().getDate();
                if (tanggal == today) {
                    Event.findByIdAndUpdate(i._id, {
                        status: 'Ongoing',
                    })
                } else if (tanggal <= today) {
                    Event.findByIdAndUpdate(i._id, {
                        status: 'Finished',
                    });
                };
            });
        })
});

module.exports = {
    async createEvent(req, res) {
        try {
            let tanggal = new Date(req.body.date);
            let today = new Date();
            let status;
            if (tanggal.setHours(0,0,0,0) == today.setHours(0,0,0,0)) {
                status = 'Ongoing';
            } else if (tanggal >= today) {
                status = 'Upcoming';
            } else if (tanggal <= today) {
                status = 'Finished';
            };

            let event = await Event.create({
                name: req.body.name,
                address: req.body.address,
                date: req.body.date,
                status: status,
                description: req.body.description,
                banner: req.body.banner,
                creator: req.decoded._id,
            });
    
            let result = {
                _id: event._id,
                name: event.name,
                address: event.address,
                date: event.date,
                status: event.status,
                description: event.description,
                banner: event.banner,
                creator: event.creator,
            };
            res.status(201).json(success('Event created!', result));
        } catch (err) {
            res.status(400).json(error('Failed to create event!', err.message, 400));
        };
    },
    
    async updateEvent(req, res) {
        try {
            let isValid = await Event.findById(req.params.id);
            if (isValid.creator == req.decoded._id) {
                let event = await Event.findByIdAndUpdate(req.params.id, {
                    name: req.body.name,
                    address: req.body.address,
                    date: req.body.date,
                    description: req.body.description,
                }, { new: true });
                console.log(event);
                let result = {
                    name: event.name,
                    address: event.address,
                    date: event.date,
                    description: event.description,
                };
                return res.status(200).json(success('Event updated!', result));
            } else {
                res.status(403).json(error('Not authorized!', '-', 403));
            };
        } catch(err) {
            res.status(400).json(error('Failed to update event!', err.message, 400));
        };
    },
    
    async deleteEvent(req, res) {
        try {
            let isValid = await Event.findById(req.params.id);
            if (isValid.creator == req.decoded._id) {
                let event = await Event.findByIdAndDelete(req.params.id);
                res.status(200).json(success('Event deleted!', event));
            } else {
                res.status(403).json(error('Not authorized!', '-', 403));
            }
        } catch(err) {
            res.status(400).json(error('Failed to delete event!', err.message, 400));
        };
    },
    
    async showAllEvent(req, res) {
        try {
            let events = await Event.find({});
            res.status(200).json(success('Show all events!', events));
        } catch(err) {
            res.status(400).json(error('Failed to retrieve all event', err.message, 400));
        };
    },
    
    async showEventDetails(req, res) {
        try {
            let event = await Event.findById(req.params.id);
            res.status(200).json(success('Show event details!', event));
        } catch(err) {
            res.status(400).json(success('Failed to retrieve event details!', err.message, 400));
        };
    },
    
    async uploadBanner(req, res) {
        var fileUp = req.file;
        if (!fileUp) {
            return res.status(415).json(error('No file received: Unsupported Media Type', req.file, 415));
        };
    
        const dUri = new datauri();
        uploader(req, res, err => {
            var file = dUri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer);
            cloudinary.uploader.upload(file.content)
                .then(data => {
                    Event.findByIdAndUpdate(
                        { _id: req.params.id },
                        { $set: { banner: data.secure_url } },
                        { new: true },
                    )
                    .then((event) => {
                        return res.status(201).json(success('Banner uploaded!', event));
                    });
                })
                .catch(err => {
                    res.status(400).json(error('Failed to upload banner!', err.message, 400));
                });
        });
    },

    async eventRegister(req, res) {
        try {
            let event = await MemberEvent.create({
                member: req.decoded._id,
                event: req.params.id,
                date: Math.floor(Date.now()),
            });
            res.status(201).json(success('Registered!', event));
        } catch(err) {
            res.status(400).json(error('Failed to register member to event!', err.message, 400));
        };
    },
};
