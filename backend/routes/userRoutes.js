const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');
const upload = require('../config/cloudinary');

// Get current user
router.get('/api/user/me', requireAuth, (req, res) => {
    res.send(req.user);
});

// Set username and profile photo
router.put('/api/user/setup', requireAuth, upload.single('profilePhoto'), async (req, res) => {
    const { username } = req.body;
    let updates = {};

    // Validate username
    if (username) {
        if (req.user.isUsernameSet) {
             return res.status(400).json({ error: 'Username already set' });
        }
        
        // Check regex
        if (!/^[a-zA-Z0-9_.]{3,20}$/.test(username)) {
            return res.status(400).json({ error: 'Invalid username format' });
        }

        // Check uniqueness
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        updates.username = username;
        updates.isUsernameSet = true;
    }

    // Handle photo upload
    if (req.file) {
        updates.profilePhoto = req.file.path;
    }

    try {
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
        res.send(user);
    } catch (err) {
        res.status(500).json({ error: 'Error updating profile' });
    }
});

// Get public user info by username
router.get('/api/u/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select('username profilePhoto _id');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.send(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
