const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to frontend dashboard or setup
        // We can check if username is set to decide where to redirect
        if (req.user.isUsernameSet) {
            res.redirect(`${process.env.CLIENT_URL}/dashboard`);
        } else {
            res.redirect(`${process.env.CLIENT_URL}/setup`);
        }
    }
);

router.get('/api/current_user', (req, res) => {
    res.send(req.user);
});

router.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
