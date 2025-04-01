const mongoose = require('mongoose');

// Fix: MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error('MONGO_URI is missing in environment variables. Set it in your .env file or Render environment variables.');
    process.exit(1); // Exit if no MongoDB URI is provided
}

const connectDB = () => {
    mongoose.connect(mongoURI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => {
            console.error('MongoDB connection error:', err);
            process.exit(1); // Exit on connection failure
        });
};

module.exports = connectDB; 