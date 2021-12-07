var nodemailer = require('nodemailer');
var nodemailersendGrid = require('nodemailer-sendgrid');
require('dotenv').config();

var transporter = nodemailer.createTransport(
    nodemailersendGrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);

var jwt = require('jsonwebtoken');
const Member = require('../models/memberModel');
var { success, error } = require('../helpers/response');

exports.sendResetPassword = async (email, res) => {

    const memberExist = await Member.findOne({ email: email, isVerified: true });

    if (!memberExist) {
        return res.status(404).json(error('Register and verify your email first', '', 404));
    };

    const token = jwt.sign({ _id: memberExist._id}, process.env.SECRET_KEY, { expiresIn: '1h' });

    transporter.sendMail({
        from: 'admin@solso.com',
        to: email,
        subject: 'Reset Password',
        html: `<p>Copy Token below and go to the link given!</p>
                <p> ${token} </p>
                <a href="${process.env.FE_RESET_PASSWORD}">Click Here</a>`
    })
    .then(() => res.status(200).json(success(`Email sent to ${email}`, token)))
    .catch(err => res.send(err));
};
