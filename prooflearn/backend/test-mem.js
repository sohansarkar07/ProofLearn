require('dotenv').config();
const mongoose = require('mongoose');

async function debug() {
    console.log("=== DEBUG START ===");
    console.log("CWD:", process.cwd());
    const uri = process.env.MONGODB_URI;
    console.log("MONGODB_URI:", uri ? uri.replace(/\/\/.*@/, '//***@') : "UNDEFINED");

    // Test 1: Require Package
    try {
        console.log("Attempting to require 'mongodb-memory-server'...");
        const { MongoMemoryServer } = require('mongodb-memory-server');
        console.log("Require SUCCESS.");

        // Test 2: Create Server
        console.log("Creating MongoMemoryServer instance...");
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        console.log("MongoMemoryServer SUCCESS. URI:", memUri);

        // Test 3: Connect Mongoose
        console.log("Connecting Mongoose to In-Memory DB...");
        await mongoose.connect(memUri);
        console.log("Mongoose Connection SUCCESS.");
        await mongoose.disconnect();
        await mongod.stop();

    } catch (e) {
        console.error("DEBUG FAILURE:", e.message);
        if (e.code === 'MODULE_NOT_FOUND') {
            console.error("CRITICAL: The package 'mongodb-memory-server' is NOT INSTALLED or not found.");
            console.error("Please run: npm install mongodb-memory-server");
        }
        console.error(e);
    }
    console.log("=== DEBUG END ===");
}

debug();
