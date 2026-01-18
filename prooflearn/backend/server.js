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
app.use('/api/tasks', taskRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', userRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prooflearn')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
