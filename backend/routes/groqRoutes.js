const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
    generateScript,
    getScriptHistory
} = require('../controllers/groqController');

router.post('/generate', protect, generateScript);
router.get('/history', protect, getScriptHistory);

module.exports = router; 