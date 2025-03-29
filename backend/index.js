const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { CohereClientV2 } = require('cohere-ai');
const User = require('./models/User');
const errorHandler = require('./middleware/error');
const Script = require('./models/Script');

// Load environment variables
dotenv.config();

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

const app = express();
const port = process.env.PORT || 5000;

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

// Fix: MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error('MONGO_URI is missing in environment variables. Set it in your .env file or Render environment variables.');
    process.exit(1); // Exit if no MongoDB URI is provided
}

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit on connection failure
    });

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to PromoGenie AI Backend' });
});

// Register route
app.post('/api/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create new user
        const user = new User({ fullName, email, password });
        await user.save();
        console.log('User registered successfully:', email);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: 'This email is not registered. Please create an account first.',
                code: 'EMAIL_NOT_FOUND'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Invalid password. Please try again.',
                code: 'INVALID_PASSWORD'
            });
        }

        // Generate a simple token (you should use JWT in production)
        const token = Buffer.from(`${user._id}:${Date.now()}`).toString('base64');

        res.json({ 
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get current user route
app.get('/api/users/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Decode the token (simple base64 for now)
        const [userId] = Buffer.from(token, 'base64').toString().split(':');
        
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

// Script generation route
app.post('/api/generate-script', async (req, res) => {
    try {
        // Verify token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Get user ID from token
        const [userId] = Buffer.from(token, 'base64').toString().split(':');

        const { productName, targetAudience, tone, adStyle, callToAction } = req.body;

        // Validate required fields
        if (!productName || !targetAudience) {
            return res.status(400).json({
                success: false,
                message: 'Product name and target audience are required'
            });
        }

        // Create prompt for Cohere
        const prompt = `Generate 8 different advertising scripts for ${productName} targeting ${targetAudience}. 
        Tone: ${tone}
        Style: ${adStyle}
        Call to Action: ${callToAction || 'Get started today!'}
        
        Requirements:
        1. Each script should be unique, engaging, and concise
        2. Follow the specified tone and style
        3. Keep each script between 2-3 sentences
        4. Make each script memorable and persuasive
        5. Include the call to action naturally
        6. Format each script with just a number (1-8) followed by a colon, like this:
        
        Example format:
        1: Your script text here with a natural call to action.
        2: Another script text here with a natural call to action.
        
        Important: Do not include any categories or labels (like "Problem-Solution" or "Storytelling"). Just number them 1-8.`;

        console.log('Sending request to Cohere with prompt:', prompt);

        // Generate scripts using Cohere
        const response = await cohereClient.chat({
            model: 'command-a-03-2025',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8,
            max_tokens: 1000
        });

        // Extract and process scripts
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
                    .split(/\d+\./)
                    .filter(script => script.trim())
                    .map(script => script.trim());
            } else {
                scripts = [content.toString()];
            }
        }

        // Clean up scripts
        scripts = scripts
            .map(script => script.replace(/^\d+\.\s*/, '').trim())
            .filter(script => script.length > 0);

        // Ensure we have exactly 8 scripts
        if (scripts.length > 8) {
            scripts = scripts.slice(0, 8);
        } else if (scripts.length < 8) {
            // Generate additional scripts if needed
            const additionalPrompt = `Generate ${8 - scripts.length} more unique advertising scripts for ${productName} targeting ${targetAudience}. 
            Tone: ${tone}
            Style: ${adStyle}
            Call to Action: ${callToAction || 'Get started today!'}
            
            Make sure these are different from the previous scripts.`;

            const additionalResponse = await cohereClient.chat({
                model: 'command-a-03-2025',
                messages: [
                    {
                        role: 'user',
                        content: additionalPrompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 500
            });

            let additionalScripts = [];
            if (additionalResponse.message && additionalResponse.message.content) {
                const additionalContent = additionalResponse.message.content;
                if (Array.isArray(additionalContent)) {
                    additionalScripts = additionalContent.map(item => {
                        if (typeof item === 'object' && item.text) {
                            return item.text;
                        }
                        return typeof item === 'string' ? item : JSON.stringify(item);
                    }).filter(Boolean);
                } else if (typeof additionalContent === 'string') {
                    additionalScripts = additionalContent
                        .split(/\d+\./)
                        .filter(script => script.trim())
                        .map(script => script.trim());
                } else {
                    additionalScripts = [additionalContent.toString()];
                }
            }

            additionalScripts = additionalScripts
                .map(script => script.replace(/^\d+\.\s*/, '').trim())
                .filter(script => script.length > 0);

            scripts = [...scripts, ...additionalScripts].slice(0, 8);
        }

        // Save the scripts to the database
        const newScript = new Script({
            userId,
            productName,
            targetAudience,
            tone,
            adStyle,
            callToAction,
            scripts
        });

        await newScript.save();

        res.json({
            success: true,
            scripts: scripts
        });
    } catch (error) {
        console.error('Script generation error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        res.status(500).json({
            success: false,
            message: error.message || 'Error generating scripts',
            details: error.response?.data || 'No additional details available'
        });
    }
});

// Get user's script history
app.get('/api/scripts/history', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Get user ID from token
        const [userId] = Buffer.from(token, 'base64').toString().split(':');

        // Get all scripts for this user, sorted by creation date
        const scripts = await Script.find({ userId })
            .sort({ createdAt: -1 })
            .select('-__v');

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

// Change password route
app.post('/api/users/change-password', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Decode the token to get user ID
        const [userId] = Buffer.from(token, 'base64').toString().split(':');
        
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Check if new passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'New passwords do not match' 
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ 
            success: true, 
            message: 'Password updated successfully' 
        });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error changing password' 
        });
    }
});

// 404 Error for undefined routes
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Resource not found' });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
