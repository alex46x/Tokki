const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Log user in automatically (using Passport's req.login)
        req.login(newUser, (err) => {
            if (err) return res.status(500).json({ error: 'Login after signup failed' });
            res.json(newUser);
        });
    } catch (err) {
        res.status(500).json({ error: 'Error creating user' });
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        req.login(user, (err) => {
            if (err) return next(err);
            res.json(user);
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
