const { CohereClientV2 } = require('cohere-ai');

let cohereClient;

const initializeCohere = () => {
    try {
        cohereClient = new CohereClientV2({
            token: process.env.COHERE_API_KEY
        });
        console.log('Cohere client initialized successfully');
        return cohereClient;
    } catch (error) {
        console.error('Failed to initialize Cohere client:', error);
        process.exit(1);
    }
};

module.exports = {
    initializeCohere,
    getClient: () => cohereClient
}; 