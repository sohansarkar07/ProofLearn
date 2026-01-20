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

// Debug Route
app.get('/api/test-db', async (req, res) => {
    try {
        await connectDB();
        res.json({
            status: 'connected',
            readyState: mongoose.connection.readyState,
            dbName: mongoose.connection.name
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message, stack: err.stack });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
        message: "Internal Server Error",
        details: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// DB Connection Helper (Cached)
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    if (mongoose.connection.readyState === 2) {
        return new Promise((resolve, reject) => {
            mongoose.connection.once('connected', resolve);
            mongoose.connection.once('error', reject);
        });
    }

    try {
        let uri = process.env.MONGODB_URI;

        // Attempt to connect to provided URI first (if valid)
        if (uri) {
            console.log("Connecting to standard MongoDB URI...");
            try {
                await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
                console.log('MongoDB Connected successfully');
                return;
            } catch (err) {
                console.warn("Standard MongoDB connection failed, falling back to In-Memory DB.", err.message);
            }
        }

        // Fallback or default to In-Memory DB
        console.log("Starting In-Memory MongoDB...");
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        console.log("In-Memory MongoDB started at:", memoryUri);

        await mongoose.connect(memoryUri);
        console.log('In-Memory MongoDB Connected successfully');

    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        // Do NOT throw error, just log it so server stays alive
        console.log("Proceeding without robust DB connection...");
    }
};

// Initial connection removed for serverless compatibility
// connectDB();

// Root route
app.get('/', (req, res) => res.json({ message: "ProofLearn API is running" }));

// Only listen if running locally
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
