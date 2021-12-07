const router = require('express').Router();
const { isAuthenticated } = require('../../middlewares/auth');
const upload = require('../../middlewares/multer');
const {
    createMember,
    verify,
    login,
    showProfile,
    updateMember,
    updatePassword,
    uploadImage,
    sendPasswordReset,
    resetPassword,
    deleteMember,
    showAllMember,
    showMemberDetails,
} = require('../../controllers/memberController');

router.post('/create-member', createMember);
router.get('/verify/:token', verify);
router.post('/login', login);
router.get('/show-profile', isAuthenticated, showProfile);
router.put('/update', isAuthenticated, updateMember);
router.put('/update-password', isAuthenticated, updatePassword);
router.put('/upload', isAuthenticated, upload.single('image'), uploadImage);
router.post('/reset-password', sendPasswordReset);
router.put('/reset', resetPassword);
router.delete('/delete-member', isAuthenticated, deleteMember);
router.get('/show-member', isAuthenticated, showAllMember);
router.get('/show-member/:id', isAuthenticated, showMemberDetails);

module.exports = router;
