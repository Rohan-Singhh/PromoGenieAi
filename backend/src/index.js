const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const setupMiddleware = require('./config/middleware');
const authRoutes = require('./routes/authRoutes');
const scriptRoutes = require('./routes/scriptRoutes');
const errorHandler = require('../middleware/error');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Setup middleware
setupMiddleware(app);

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to PromoGenie AI Backend' });
});

app.use('/api', authRoutes);
app.use('/api/scripts', scriptRoutes);

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