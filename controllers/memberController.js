require('dotenv').config();
const Member = require('../models/memberModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const funcHelper = require('../helpers/funcHelper');
const { success, error } = require('../helpers/response');
const { sendResetPassword } = require('../services/nodemailer');
const DatauriParser = require('datauri/parser');
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
const uploader = multer().single('image');
const cloudinary = require('cloudinary').v2;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const saltRounds = 10;

module.exports = {
    async createMember(req, res) {
        try {
            const usernameValidation = await Member.findOne({ username: req.body.username });
            if (usernameValidation)
                return res.status(400).json(error('Username is already taken!', '-', 400));
            const emailValidation = await Member.findOne({ email: req.body.email });
            if (emailValidation)
                return res.status(400).json(error('Email is already used!', '-', 400));

            if (req.body.password.length <= 5 || req.body.password.length >= 33) {
                return res.status(400).json(error('Password must be between 6-32 characters', '-', 400));
            } else {
                let pwd = bcrypt.hashSync(req.body.password, saltRounds);
                var token = funcHelper.token(20);
                let member = await Member.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: pwd,
                    fullName: req.body.fullName,
                    address: req.body.address,
                    phone: req.body.phone,
                    gender: req.body.gender,
                    token: token,
                });

                var to = req.body.email;
                var from = 'admin@solso.com';
                var subject = 'Email verification in Solso';

                var link = "http://" + req.get('host') + "/api/member/verify/" + token;
                var html = 'Plese click link bellow, if you register at Solso<br>';
                html += '<br><strong><a href=' + link + '>' + "Verify Email" + '</a></strong>';
                html += '<br><br>Thanks';

                await funcHelper.mail(to, from, subject, html);

                let result = {
                    _id: member._id,
                    username: member.username,
                    token: member.token,
                };
                res.status(201).json(success("Member created!", result));
            };
        } catch(err) {
            res.status(400).json(error('Failed to create member!', err.message, 400));
        };
    },

    async verify(req, res) {
        try {
            await Member.findOneAndUpdate({ token: req.params.token }, { isVerified: true });
            res.status(200).redirect(process.env.FE_HOME_URL);
        } catch(err) {
            res.status(400).redirect(process.env.INVALID_VERIFY_URL);
        };
    },

    async login(req, res) {
        try {
            const member = await Member.findOne({ username: req.body.username });
            if (!member) {
                return res.status(404).json(error('Invalid login', '-', 404));
            } else if (member.isVerified != true) {
                return res.status(403).json(error('Please verify your email first!', '-', 403));
            };

            bcrypt.compare(req.body.password, member.password, (err, data) => {
                if (data != true)
                    return res.status(403).json(error('Password incorrect!', err, 403));
                let token = jwt.sign({ _id: member._id, username: member.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.setHeader('Authorization', token);
                let hasil = {
                    token: token,
                    _id: member._id,
                };
                return res.status(200).json(success('Token created! Access given!', hasil));
            })
        } catch(err) {
            res.status(400).json(error('Failed to login!', err.message, 400));
        }
    },

    async showProfile(req, res) {
        let member = await Member.findById(req.decoded._id);
        res.status(200).json(success('Show member details', member));
    },

    async updateMember(req, res) {
        if (req.body.fullName == "" || req.body.fullName == null) {
            return res.status(400).json(error("Failed to updated! Name can't be blank!", "-", 400));
        }
        try {
            let member = await Member.findByIdAndUpdate(req.decoded._id, {
                fullName: req.body.fullName,
                address: req.body.address,
                phone: req.body.phone,
                gender: req.body.gender,
            }, { new: true });
            res.status(200).json(success('Update member success!', member));
        } catch(err) {
            res.status(400).json(error('Update member failed!', err.message, 400));
        };
    },

    async updatePassword(req, res) {
        if (!req.body.password) {
            return res.status(400).json(error("Failed to update! Password can't be blank!", "-", 400));
        };
        if (req.body.password) {
            let pwd = bcrypt.hashSync(req.body.password.toString(), saltRounds);
            req.body.password = pwd;
            let member = await Member.findByIdAndUpdate(req.decoded._id, {
                password: req.body.password
            }, { new: true });

            var to = member.email;
            var from = 'admin@solso.com';
            var subject = '[Important] Password changed in Solso';
            var html = 'Your password has been changed recently<br>';
            html += "If you did not recognize this activity please contact admin@solso.com<br>";
            html += "<br><br> Thanks";

            await funcHelper.mail(to, from, subject, html);

            res.status(200).json(success('Password updated!', member));
        };
    },

    async uploadImage(req, res) {
        var fileUp = req.file;
        if (!fileUp) {
            return res.status(415).json(error('No file received: Unsupported Media Type', req.file, 415));
        };

        const dUri = new DatauriParser();

        uploader(req, res, err => {
            var file = dUri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer);
            cloudinary.uploader.upload(file.content)
                .then(data => {
                    Member.findByIdAndUpdate({ _id: req.decoded._id },
                        { $set: { profilePic: data.secure_url } },
                        { new: true })
                        .then((member) => {
                            return res.status(201).json(
                                success('Image uploaded!', member)
                            );
                        });
                })
                .catch(err => {
                    res.status(400).json(error('Upload image falied', err, 400));
                });
        });
    },

    async sendPasswordReset(req, res) {
        var email = req.body.email;
        sendResetPassword(email, res);
    },

    async resetPassword(req, res) {
        try {
            var token = req.body.token;
            let pwd = bcrypt.hashSync(req.body.password, saltRounds);
            var decoded = jwt.verify(token, process.env.SECRET_KEY);

            await Member.updateOne({ _id: decoded._id }, { password: pwd });
            res.status(200).json(success('Password successfully updated!'));
        } catch(err) {
            res.status(404).json(error('The token is expired or invalid', err, 404));
        };
    },

    async deleteMember(req, res) {
        try {
            let member = await Member.findByIdAndDelete(req.decoded._id);
            res.status(200).json(success('Delete user success', member));
        } catch(err) {
            res.status(400).json(error('Delete user failed', err.message, 400));
        };
    },

    async showAllMember(req, res) {
        try {
            let member = await Member.find({});
            res.status(200).json(success('Show all member success', member));
        } catch(err) {
            res.status(400).json(error('Show all member failed', err.message, 400));
        }
    },

    async showMemberDetails(req, res) {
        try {

            let member = await Member.findById(req.params.id);
            res.status(200).json(success('Show selected member details', member));

        } catch(err) {
            res.status(404).json(error('Member not found', err, 404));
        };
    },
}
