const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generateScripts, getUserScripts, deleteScript } = require('../services/scriptService');
const Script = require('../../models/Script');
const cohereClient = require('../config/cohere');

// Script generation route
router.post('/generate', async (req, res) => {
    try {
        // Verify token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Get user ID from token
        const [userId] = Buffer.from(token, 'base64').toString().split(':');

        // Validate required fields
        if (!req.body.productName || !req.body.targetAudience) {
            return res.status(400).json({
                success: false,
                message: 'Product name and target audience are required'
            });
        }

        // Call the service to generate scripts
        const script = await generateScripts({
            ...req.body,
            userId
        });

        res.json({
            success: true,
            scripts: script.scripts
        });
    } catch (error) {
        console.error('Script generation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error generating scripts'
        });
    }
});

// Get user's script history
router.get('/history', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Get user ID from token
        const [userId] = Buffer.from(token, 'base64').toString().split(':');

        // Call the service to get scripts
        const scripts = await getUserScripts(userId);

        res.json({
            success: true,
            scripts: scripts
        });
    } catch (error) {
        console.error('Error fetching script history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching script history'
        });
    }
});

module.exports = router; 