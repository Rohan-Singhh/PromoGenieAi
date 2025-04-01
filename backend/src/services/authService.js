const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const registerUser = async (userData) => {
    const { fullName, email, password } = userData;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        fullName,
        email,
        password
    });

    const token = generateToken(user._id);

    return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        theme: user.theme,
        token
    };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken(user._id);

    return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        theme: user.theme,
        token
    };
};

module.exports = {
    registerUser,
    loginUser,
    generateToken
}; 