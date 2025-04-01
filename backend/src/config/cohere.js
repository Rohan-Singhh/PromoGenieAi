const { CohereClientV2 } = require('cohere-ai');

// Check for required environment variables
if (!process.env.COHERE_API_KEY) {
    console.error('COHERE_API_KEY is missing in environment variables');
    process.exit(1);
}

// Initialize Cohere with error handling
let cohereClient;
try {
    cohereClient = new CohereClientV2({
        token: process.env.COHERE_API_KEY
    });
    console.log('Cohere client initialized successfully');
} catch (error) {
    console.error('Failed to initialize Cohere client:', error);
    process.exit(1);
}

module.exports = cohereClient; 