const jwt = require('jsonwebtoken');
const Member = require('../models/memberModel');

exports.isAuthenticated = function(req, res, next) {
    var token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) {
                return res.json({ message: 'Failed to authenticate token' });
            }
            else {
                req.decoded = decoded;
                Member.findById(req.decoded._id, (err, member) => {
                    if (!member) return res.status(403).json({message: `${err}`});
                    else next();
                })
            };
        });
    }
    else {
        return res.status(401).send({ message: 'No token provided' });
    };
};
