const axios = require('axios');

const getClient = () => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set in environment variables');
    }

    return axios.create({
        baseURL: 'https://api.groq.com/openai/v1',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
};

module.exports = {
    getClient
}; 