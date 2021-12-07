require('dotenv').config();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});

var storage = multer.memoryStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images');
    },
    fileFilter: function (req, file, inst) {

        var allowedType = /jpeg|jpg|png|img|pdf/
        var extFile = allowedType.test(path.extname(file.originalname).toLowerCase());
        var mimeType = allowedType.test(file.mimetype);

        if (extFile && mimeType) {
            inst(null, true);
        } else {
            inst(null, false);
        };
    },
});
var upload = multer({ storage: storage });

module.exports = upload;
