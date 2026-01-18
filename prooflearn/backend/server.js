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
        error: process.env.NODE_ENV === 'production' ? "See logs for details" : err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// DB Connection Helper (Cached)
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;
        const uri = process.env.MONGODB_URI;
        if (!uri && process.env.NODE_ENV === 'production') {
            throw new Error("MONGODB_URI is missing in production environment variables.");
        }
        if (!uri) {
            console.warn("MONGODB_URI is not defined in environment variables. Falling back to localhost.");
        }
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri || 'mongodb://localhost:27017/prooflearn');
        console.log('MongoDB Connected successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
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
