const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateTheme
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/theme', protect, updateTheme);

module.exports = router; 