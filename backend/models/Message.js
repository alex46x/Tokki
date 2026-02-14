const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 500
    },
    ipHash: {
        type: String, // Store hashed IP for basic rate limiting/abuse prevention
        select: false // Don't return by default
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
