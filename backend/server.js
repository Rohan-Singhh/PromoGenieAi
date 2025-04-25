const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Load environment variables and configurations
const loadEnv = require('./config/dotenv');
loadEnv();

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;
const alternatePort = 5001; // Alternate port if primary is in use

// Trust proxies for rate limiting
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB().then(() => {
    console.log('✅ MongoDB Connected Successfully');
}).catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
});

// Middleware
app.use(morgan('dev'));

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
        if (!origin || origin.includes('localhost') || 
            origin.includes('vercel.app') || 
            origin.includes('onrender.com') || 
            allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scripts', require('./routes/groqRoutes'));

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to PromoGenie AI Backend' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server with fallback port
const startServer = () => {
    try {
        app.listen(port, () => {
            console.log('\n🚀 Server Initialization:');
            console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${port}`);
            console.log('✅ API Routes:');
            console.log('   - /api/auth: Authentication endpoints');
            console.log('   - /api/scripts: Script generation endpoints');
            console.log('\n📝 Environment Setup:');
            console.log(`✅ NODE_ENV: ${process.env.NODE_ENV}`);
            console.log(`✅ GROQ API: ${process.env.GROQ_API_KEY ? 'Configured' : 'Missing'}`);
            console.log('\n🔒 Security:');
            console.log('✅ CORS: Configured');
            console.log('✅ Helmet: Enabled');
            console.log('✅ Rate Limiting: Enabled');
            console.log('\n🌐 Server is ready to handle requests!\n');
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is busy, trying alternate port ${alternatePort}`);
                app.listen(alternatePort, () => {
                    console.log(`Server running in ${process.env.NODE_ENV} mode on alternate port ${alternatePort}`);
                });
            } else {
                console.error('Server error:', err);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 