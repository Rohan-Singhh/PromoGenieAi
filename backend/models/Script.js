const mongoose = require('mongoose');

const scriptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    targetAudience: {
        type: String,
        required: true
    },
    tone: {
        type: String,
        required: true
    },
    adStyle: {
        type: String,
        required: true
    },
    callToAction: {
        type: String
    },
    scripts: [{
        type: String,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Script', scriptSchema); 