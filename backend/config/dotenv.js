const dotenv = require('dotenv');

const loadEnv = () => {
    dotenv.config();
    
    const requiredEnvVars = [
        'MONGODB_URI',
        'COHERE_API_KEY',
        'JWT_SECRET',
        'NODE_ENV'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
        console.error('Missing required environment variables:', missingEnvVars.join(', '));
        process.exit(1);
    }
};

module.exports = loadEnv; 