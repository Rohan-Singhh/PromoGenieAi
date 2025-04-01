const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const setupMiddleware = (app) => {
    // Fix: Trust proxies for rate limiting
    app.set("trust proxy", 1);

    // Middleware
    app.use(morgan('dev')); // Logging HTTP requests

    // CORS Configuration
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://promo-genie-ai-tgyr.vercel.app',
        'https://promo-genie-ai.onrender.com',
        'https://promogenieai.vercel.app'
    ];

    app.use(cors({
        origin: function(origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            
            // Allow all localhost origins
            if (origin.includes('localhost')) {
                return callback(null, true);
            }

            // Allow all Vercel preview deployments and production URLs
            if (origin.includes('vercel.app')) {
                return callback(null, true);
            }

            // Allow all Render deployments
            if (origin.includes('onrender.com')) {
                return callback(null, true);
            }

            // For all other origins, check against the allowed list
            if (allowedOrigins.indexOf(origin) !== -1) {
                return callback(null, true);
            }

            console.log('Blocked origin:', origin); // Debug log
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Content-Range', 'X-Content-Range']
    }));

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(cookieParser());
    app.use(helmet()); // Secure HTTP headers
    app.use(compression()); // Gzip compression

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    });
    app.use(limiter);
};

module.exports = setupMiddleware; 