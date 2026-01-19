const mongoose = require('mongoose');
const User = require('../models/User'); // Relative to this script in backend/scripts/
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const walletToPromote = process.argv[2];

if (!walletToPromote) {
    console.error("Usage: node scripts/make-admin.js <wallet_address>");
    process.exit(1);
}

async function promoteUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        let user = await User.findOne({ walletAddress: walletToPromote });

        if (!user) {
            console.log("User not found, creating new admin user...");
            user = new User({ walletAddress: walletToPromote });
        }

        user.role = 'admin';
        await user.save();

        console.log(`✅ Success! ${walletToPromote} is now an ADMIN.`);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

promoteUser();
