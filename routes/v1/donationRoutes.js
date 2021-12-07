const router = require('express').Router();
const { isAuthenticated } = require('../../middlewares/auth');
const {
    createDonation,
    updateDonation,
    deleteDonation,
    payDonation,
    getAllDonationPayment,
    getAllEventDonation,
} = require('../../controllers/donationController');

router.post('/create-donation', isAuthenticated, createDonation);
router.post('/create-donation/:event', isAuthenticated, createDonation);
router.put('/update-donation/:id', isAuthenticated, updateDonation);
router.delete('/delete-donation/:id', isAuthenticated, deleteDonation);
router.post('/pay-donation/:id', isAuthenticated, payDonation);
router.get('/show-donation/:id', isAuthenticated, getAllDonationPayment);
router.get('/show-event/id', isAuthenticated, getAllEventDonation);

module.exports = router;
