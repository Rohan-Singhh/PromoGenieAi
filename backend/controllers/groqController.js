const { getClient } = require('../config/groq');
const Script = require('../models/Script');
const { validateScriptGeneration } = require('../utils/inputValidator');

// @desc    Generate video ad scripts
// @route   POST /api/scripts/generate
// @access  Private
const generateScript = async (req, res) => {
    try {
        const { isValid, errors } = validateScriptGeneration(req.body);
        
        if (!isValid) {
            return res.status(400).json({ success: false, errors });
        }

        const { productName, targetAudience, tone, adStyle, callToAction } = req.body;

        const prompt = `As a Facebook marketer, create 4 engaging and concise video ad scripts for ${productName}, tailored for ${targetAudience}. 
        Make the tone feel natural and relatable — like you're talking to a friend. 
        Keep the style clear, scroll-stopping, and super easy to understand. 
        Focus on showing value quickly and emotionally connecting with the viewer. 
        End each script with a strong, friendly call to action like: ${callToAction || 'Get started today!'}
        
        Requirements for each script:
        1. Each script should be 60-90 seconds long
        2. Break down each script into these sections:
           Opening Hook (10-15 seconds)
           Problem/Solution (20-30 seconds)
           Key Benefits (20-25 seconds)
           Call to Action (10-15 seconds)

        For each section, include:
        Visual: [Brief description]
        Voice: [Brief narration style]
        Action: [Key actions]
        
        Please number each script clearly as "Script 1:", "Script 2:", etc. up to Script 4.`;

        const groqClient = getClient();
        const response = await groqClient.post('/chat/completions', {
            model: 'llama3-70b-8192',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert Facebook video ad script writer.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 4096
        });

        let scripts = [];
        if (response.data?.choices && response.data.choices[0]?.message?.content) {
            const content = response.data.choices[0].message.content;
            scripts = typeof content === 'string' 
                ? content.split(/(?=Script \d+:)/i).filter(script => script.trim())
                : Array.isArray(content) 
                    ? content.map(item => typeof item === 'object' ? item.text : item).filter(Boolean)
                    : [];
        }

        // Take only the first 4 scripts if we have more
        if (scripts.length > 4) {
            scripts = scripts.slice(0, 4);
        }

        // Save to database
        const newScript = await Script.create({
            userId: req.user._id,
            productName,
            targetAudience,
            tone,
            adStyle,
            callToAction,
            scripts
        });

        res.json({
            success: true,
            scripts: newScript.scripts
        });
    } catch (error) {
        console.error('Script generation error:', error?.response?.data || error.message || error);
        res.status(500).json({
            success: false,
            message: 'Error generating scripts',
            details: error.response?.data?.error || error.message || 'No additional details available'
        });
    }
};

// @desc    Get user's script history
// @route   GET /api/scripts/history
// @access  Private
const getScriptHistory = async (req, res) => {
    try {
        const scripts = await Script.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.json({
            success: true,
            scripts
        });
    } catch (error) {
        console.error('Error fetching script history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching script history'
        });
    }
};

module.exports = {
    generateScript,
    getScriptHistory
}; 