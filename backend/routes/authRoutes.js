const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, updatePassword, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);   // no auth required — just clear the cookie
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
