const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');
const requireAuth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for sending messages (e.g., 5 per minute per IP)
const messageLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: { error: 'Too many messages, please try again later.' }
});

// Send anonymous message to a user
router.post('/api/message/:username', messageLimiter, async (req, res) => {
    const { username } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Message cannot be empty' });
    }

    try {
        const receiver = await User.findOne({ username });
        if (!receiver) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newMessage = new Message({
            receiverId: receiver._id,
            content: content,
            ipHash: req.ip // In a real app, hash this
        });

        await newMessage.save();
        res.status(201).json({ message: 'Message sent!' });
    } catch (err) {
        res.status(500).json({ error: 'Error sending message' });
    }
});

// Get my messages
router.get('/api/messages', requireAuth, async (req, res) => {
    try {
        const messages = await Message.find({ receiverId: req.user._id })
            .sort({ createdAt: -1 }); // Newest first
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

// Delete a message
router.delete('/api/message/:id', requireAuth, async (req, res) => {
    try {
        const message = await Message.findOne({ _id: req.params.id, receiverId: req.user._id });
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        await message.remove(); // or deleteOne for newer Mongoose
        // await Message.deleteOne({ _id: req.params.id }); 
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting message' });
    }
});

module.exports = router;
