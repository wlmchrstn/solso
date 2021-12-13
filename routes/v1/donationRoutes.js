const router = require('express').Router();
const { isAuthenticated } = require('../../middlewares/auth');
const {
    createDonation,
    updateDonation,
    deleteDonation,
    showAllDonation,
    showDonationDetail,
    payDonation,
} = require('../../controllers/donationController');

router.post('/create-donation', isAuthenticated, createDonation);
router.post('/create-donation/:event', isAuthenticated, createDonation);
router.put('/update-donation/:id', isAuthenticated, updateDonation);
router.delete('/delete-donation/:id', isAuthenticated, deleteDonation);
router.get('/show-donation', isAuthenticated, showAllDonation);
router.get('/show-donation/:id', isAuthenticated, showDonationDetail);
router.post('/pay-donation/:id', isAuthenticated, payDonation);

module.exports = router;
