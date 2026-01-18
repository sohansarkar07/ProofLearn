require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const taskRoutes = require('./routes/taskRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware to ensure DB connection
const ensureDB = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ message: "Database connection failed", error: err.message });
    }
};

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Routes
app.use('/api/tasks', ensureDB, taskRoutes);
app.use('/api/submissions', ensureDB, submissionRoutes);
app.use('/api/users', ensureDB, userRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
        message: "Internal Server Error",
        details: err.message, // Return the message directly for debugging
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// DB Connection Helper (Cached)
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    if (mongoose.connection.readyState === 2) {
        // Wait for current connection attempt
        return new Promise((resolve, reject) => {
            mongoose.connection.once('connected', resolve);
            mongoose.connection.once('error', reject);
        });
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri && process.env.NODE_ENV === 'production') {
            throw new Error("Environment Variable MONGODB_URI is MISSING in Vercel. Please add it to your project settings.");
        }
        if (!uri) {
            console.warn("MONGODB_URI is not defined in environment variables. Falling back to localhost.");
        }
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri || 'mongodb://localhost:27017/prooflearn');
        console.log('MongoDB Connected successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        throw err; // Re-throw to be caught by ensureDB or global handler
    }
};

// Initial connection
connectDB();

// Root route
app.get('/', (req, res) => res.json({ message: "ProofLearn API is running" }));

// Only listen if running locally
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
