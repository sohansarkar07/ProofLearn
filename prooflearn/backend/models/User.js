const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    skills: {
        type: Map,
        of: Number,
        default: {
            "Solidity": 10,
            "React": 10,
            "Design": 5,
            "Security": 0,
            "DeFi": 0
        }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
