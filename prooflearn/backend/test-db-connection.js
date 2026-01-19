const mongoose = require('mongoose');

async function testConnection() {
    // Force 127.0.0.1
    const uri = 'mongodb://127.0.0.1:27017/prooflearn';
    console.log("Attempting to connect to:", uri);

    try {
        console.log("Connecting...");
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log("SUCCESS: MongoDB Connected to 127.0.0.1!");
        await mongoose.disconnect();
    } catch (error) {
        console.error("CONNECTION FAILED:");
        console.error(error.message);
    }
}

testConnection();
