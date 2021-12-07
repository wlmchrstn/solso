const router = require('express').Router();
const { isAuthenticated } = require('../../middlewares/auth');
const upload = require('../../middlewares/multer');
const {
    createEvent,
    updateEvent,
    deleteEvent,
    showAllEvent,
    showEventDetails,
    uploadBanner,
    eventRegister,
} = require('../../controllers/eventController');

router.post('/create-event', isAuthenticated, createEvent);
router.put('/update-event/:id', isAuthenticated, updateEvent);
router.delete('/delete-event/:id', isAuthenticated, deleteEvent);
router.get('/show-event', isAuthenticated, showAllEvent);
router.get('/show-event/:id', isAuthenticated, showEventDetails);
router.put('/upload/:id', isAuthenticated, upload.single('image'), uploadBanner);
router.post('/register-event/:id', isAuthenticated, eventRegister);

module.exports = router;
