const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    displayName: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined to be non-unique (for users who haven't set it yet)
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                // Simple regex for username: alphanumeric, underscore, dot, 3-20 chars
                return /^[a-zA-Z0-9_.]{3,20}$/.test(v);
            },
            message: props => `${props.value} is not a valid username!`
        }
    },
    profilePhoto: {
        type: String,
        default: ''
    },
    isUsernameSet: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Ensure username is immutable once set (handled in controller logic, but good to note)

module.exports = mongoose.model('User', userSchema);
