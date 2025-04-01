const Script = require('../../models/Script');
const cohereClient = require('../config/cohere');

const generateScripts = async (scriptData) => {
    const { productName, targetAudience, tone, adStyle, callToAction, userId } = scriptData;

    try {
        const prompt = `As a Facebook marketing strategist, I understand how to craft compelling video ads that captivate and convert. Generate 8 different video advertising scripts for ${productName} targeting ${targetAudience} with a ${tone} tone and ${adStyle} style.
        Tone: ${tone}
        Style: ${adStyle}
        Call to Action: ${callToAction || 'Get started today!'}
        
        Requirements for each script:
        1. Each script should be 2-3 minutes long
        2. Break down each script into these sections with clear formatting:
           Opening Hook (15-20 seconds)
           Problem Statement (20-30 seconds)
           Solution/Product Introduction (30-40 seconds)
           Key Benefits/Features (30-40 seconds)
           Social Proof/Testimonials (20-30 seconds)
           Call to Action (15-20 seconds)

        For each section, include these elements on separate lines:
        Visual: [Description of what viewers see]
        Music: [Description of background music]
        Voice: [Description of narration style]
        Action: [Description of what happens]

        Format Guidelines:
        - Do not use asterisks (*) or quotes
        - Do not use special characters
        - Keep text clean and direct
        - Use clear section headers
        - Use consistent formatting across all scripts
        - Start each script with a clear title
        - Separate sections with line breaks
        - Text overlays should be written as: Text: [content]

        Begin each script with a clear title and maintain consistent formatting throughout all scripts.`;

        console.log('Sending request to Cohere with prompt:', prompt);

        const response = await cohereClient.chat({
            model: 'command-a-03-2025',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 4000,
            stream: false
        });

        let scripts = [];
        if (response.message && response.message.content) {
            const content = response.message.content;
            if (Array.isArray(content)) {
                scripts = content.map(item => {
                    if (typeof item === 'object' && item.text) {
                        return item.text;
                    }
                    return typeof item === 'string' ? item : JSON.stringify(item);
                }).filter(Boolean);
            } else if (typeof content === 'string') {
                scripts = content
                    .split(/(?=Script \d+:)/i)
                    .filter(script => script.trim())
                    .map(script => {
                        const sections = [
                            'Opening Hook',
                            'Problem Statement',
                            'Solution/Product Introduction',
                            'Key Benefits/Features',
                            'Social Proof/Testimonials',
                            'Call to Action'
                        ];
                        
                        const hasAllSections = sections.every(section => 
                            script.includes(section)
                        );
                        
                        return hasAllSections ? script.trim() : null;
                    })
                    .filter(script => script !== null);
            }
        }

        scripts = scripts
            .filter(script => script.length > 0)
            .map((script, index) => {
                if (!script.startsWith('Script')) {
                    return `Script ${index + 1}:\n${script}`;
                }
                return script;
            });

        if (scripts.length > 7) {
            scripts = scripts.slice(0, 7);
        }

        const script = await Script.create({
            userId,
            productName,
            targetAudience,
            tone,
            adStyle,
            callToAction,
            scripts
        });

        return script;
    } catch (error) {
        console.error('Error generating scripts:', error);
        throw new Error('Failed to generate scripts');
    }
};

const getUserScripts = async (userId) => {
    return await Script.find({ userId }).sort({ createdAt: -1 });
};

const deleteScript = async (scriptId, userId) => {
    const script = await Script.findOne({ _id: scriptId, userId });
    if (!script) {
        throw new Error('Script not found');
    }
    await script.remove();
    return { message: 'Script deleted successfully' };
};

module.exports = {
    generateScripts,
    getUserScripts,
    deleteScript
}; 