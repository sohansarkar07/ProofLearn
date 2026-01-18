const mongoose = require('mongoose');

// Mock data for fallback
const MOCK_TASKS = [
    { id: 1, name: "Web3 Intro", description: "Deploy your first contract on Sepolia", rewardAmount: 100, isActive: true },
    { id: 2, name: "DeFi Master", description: "Implement a simple swap", rewardAmount: 500, isActive: true },
    { id: 3, name: "NFT Creator", description: "Create an NFT collection", rewardAmount: 300, isActive: true }
];

exports.getTasks = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.json(MOCK_TASKS);
    }
    try {
        const tasks = await Task.find({ isActive: true });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTask = async (req, res) => {
    const { id, name, description, rewardAmount } = req.body;
    try {
        const newTask = new Task({ id, name, description, rewardAmount });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
