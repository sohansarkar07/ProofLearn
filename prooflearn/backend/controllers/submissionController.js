const Submission = require('../models/Submission');
const crypto = require('crypto');
const { ethers } = require('ethers');
require('dotenv').config();

// Contract info
let SkillCertificateABI = [];
try {
    // Robust path for Vercel and Local
    const path = require('path');
    const abiPath = path.resolve(__dirname, '../../artifacts/contracts/SkillCertificate.sol/SkillCertificate.json');
    if (require.resolve(abiPath)) {
        SkillCertificateABI = require(abiPath).abi;
    }
} catch (error) {
    console.warn("ABI not found. Please run 'npx hardhat compile' or check artifacts path.");
}
const certificateAddress = process.env.CERTIFICATE_CONTRACT_ADDRESS;

const mongoose = require('mongoose');

exports.getSubmissions = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.json([]);
    }
    try {
        const submissions = await Submission.find();
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.submitTask = async (req, res) => {
    console.log("SUBMISSION REQUEST RECEIVED:", req.body);

    if (mongoose.connection.readyState !== 1) {
        console.error("DB NOT READY. State:", mongoose.connection.readyState);
        return res.status(503).json({ message: "Database not connected. Please try again in a few seconds." });
    }

    const { taskId, learnerAddress, proofUrl } = req.body;
    try {
        if (!taskId || !learnerAddress || !proofUrl) {
            console.warn("MISSING FIELDS:", { taskId, learnerAddress, proofUrl });
            return res.status(400).json({ message: "Missing required fields: taskId, learnerAddress, or proofUrl" });
        }

        const timestamp = Date.now();
        const rawString = proofUrl + learnerAddress + timestamp;
        const proofHash = crypto.createHash('sha256').update(rawString).digest('hex');

        console.log("SAVING SUBMISSION TO DB...");
        const newSubmission = new Submission({
            taskId,
            learnerAddress,
            proofUrl,
            proofHash: '0x' + proofHash,
            status: 'pending'
        });

        await newSubmission.save();
        console.log("SUBMISSION SAVED SUCCESSFULLY:", newSubmission._id);
        res.status(201).json(newSubmission);
    } catch (error) {
        console.error("SUBMISSION ERROR:", error);
        res.status(500).json({
            message: "Internal Server Error during mission submission",
            details: error.message,
            stack: error.stack
        });
    }
};

exports.verifySubmission = async (req, res) => {
    const { submissionId, status, skillName, level } = req.body;
    try {
        const submission = await Submission.findById(submissionId);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        if (status === 'approved') {
            if (!submission.mintedTokenId) {
                // Logic to mint NFT on-chain
                try {
                    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
                    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
                    const contract = new ethers.Contract(certificateAddress, SkillCertificateABI, wallet);

                    // In a real app, URI would be a metadata JSON (IPFS or Backend URL)
                    const metadataURI = `https://api.prooflearn.com/metadata/${submissionId}`;

                    const tx = await contract.safeMint(submission.learnerAddress, metadataURI, skillName, level);
                    const receipt = await tx.wait();

                    // Extract tokenId from event
                    const event = receipt.logs.find(log => log.eventName === 'CertificateMinted' || log.fragment?.name === 'CertificateMinted');
                    if (event) {
                        submission.mintedTokenId = Number(event.args.tokenId);
                    }
                } catch (mintError) {
                    console.error("MINTING FAILED (Continuing with DB update):", mintError);
                    // We continue even if mint fails so the user still gets DB approval/XP
                }
            }

            // --- GAMIFICATION UPDATE ---
            const User = require('../models/User');
            let user = await User.findOne({ walletAddress: submission.learnerAddress });

            if (!user) {
                // Create user if they don't exist yet (lazy creation)
                user = new User({ walletAddress: submission.learnerAddress });
            }

            // Award XP (e.g., 100 XP per mission)
            const XP_REWARD = 100;
            user.xp += XP_REWARD;

            // Simple Level Up Logic (Level = XP / 1000 + 1)
            user.level = Math.floor(user.xp / 1000) + 1;

            // Boost Specific Skill
            if (skillName) {
                // Default map check
                if (!user.skills) user.skills = new Map();
                const currentSkill = user.skills.get(skillName) || 0;
                // Add level as skill points (e.g. Intermediate = 20pts)
                const points = level === 'Beginner' ? 10 : level === 'Intermediate' ? 20 : 30;
                user.skills.set(skillName, currentSkill + points);
            }

            await user.save();
            console.log(`Awarded ${XP_REWARD} XP to ${user.walletAddress}`);
        }

        submission.status = status;
        await submission.save();
        res.json(submission);
    } catch (error) {
        console.error("Minting error:", error);
        res.status(400).json({ message: error.message });
    }
};
