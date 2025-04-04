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

// Update theme preference route
app.post('/api/users/theme', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Get user ID from token
        const [userId] = Buffer.from(token, 'base64').toString().split(':');
        
        const { theme } = req.body;
        if (!theme || !['light', 'dark', 'system'].includes(theme)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid theme value' 
            });
        }

        // Update user's theme preference
        const user = await User.findByIdAndUpdate(
            userId,
            { theme },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({ 
            success: true, 
            theme: user.theme
        });
    } catch (error) {
        console.error('Theme update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating theme preference' 
        });
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
        const prompt = `Generate 8 different video advertising scripts for ${productName} targeting ${targetAudience}. 
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

        // Generate scripts using Cohere
        const response = await cohereClient.chat({
            model: 'command-a-03-2025',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,  // Slightly reduced for more consistent outputs
            max_tokens: 4000,  // Increased token limit for complete scripts
            stream: false      // Ensure we get complete response
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
                // Split by "Script X:" pattern and preserve all content
                scripts = content
                    .split(/(?=Script \d+:)/i)  // Look ahead to keep the delimiter
                    .filter(script => script.trim())
                    .map(script => {
                        // Ensure each script has all required sections
                        const sections = [
                            'Opening Hook',
                            'Problem Statement',
                            'Solution/Product Introduction',
                            'Key Benefits/Features',
                            'Social Proof/Testimonials',
                            'Call to Action'
                        ];
                        
                        // Check if script has all sections
                        const hasAllSections = sections.every(section => 
                            script.includes(section)
                        );
                        
                        return hasAllSections ? script.trim() : null;
                    })
                    .filter(script => script !== null); // Remove incomplete scripts
            }
        }

        // Clean up scripts while preserving all content
        scripts = scripts
            .filter(script => script.length > 0)
            .map((script, index) => {
                // Ensure script starts with proper numbering
                if (!script.startsWith('Script')) {
                    return `Script ${index + 1}:\n${script}`;
                }
                return script;
            });

        // Take only the first 7 scripts if we have more
        if (scripts.length > 7) {
            scripts = scripts.slice(0, 7);
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
