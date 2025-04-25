const User = require('../models/User');
const { validateRegistration } = require('../utils/inputValidator');
const { generateToken } = require('../utils/tokenUtils');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { isValid, errors } = validateRegistration(req.body);
        
        if (!isValid) {
            return res.status(400).json({ success: false, errors });
        }

        const { fullName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const user = await User.create({
            fullName,
            email,
            password
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Email not registered'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email,
                theme: user.theme
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in'
        });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};

// @desc    Update user theme
// @route   PUT /api/auth/theme
// @access  Private
const updateTheme = async (req, res) => {
    try {
        const { theme } = req.body;
        
        if (!['light', 'dark', 'system'].includes(theme)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid theme value'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { theme },
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            theme: user.theme
        });
    } catch (error) {
        console.error('Theme update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating theme'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateTheme
}; 