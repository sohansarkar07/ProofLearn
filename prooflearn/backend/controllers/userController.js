const User = require('../models/User');

const mongoose = require('mongoose');

exports.loginOrRegister = async (req, res) => {
    const { walletAddress } = req.body;
    if (mongoose.connection.readyState !== 1) {
        return res.json({ walletAddress, role: 'user', mock: true });
    }
    try {
        let user = await User.findOne({ walletAddress });
        if (!user) {
            user = new User({ walletAddress });
            await user.save();
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ walletAddress: req.params.address });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
