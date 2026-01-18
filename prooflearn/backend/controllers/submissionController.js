const Submission = require('../models/Submission');
const crypto = require('crypto');
const { ethers } = require('ethers');
require('dotenv').config();

// Contract info
let SkillCertificateABI;
try {
    SkillCertificateABI = require('../../artifacts/contracts/SkillCertificate.sol/SkillCertificate.json').abi;
} catch (error) {
    console.warn("ABI not found. Please run 'npx hardhat compile'.");
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
    const { taskId, learnerAddress, proofUrl } = req.body;
    try {
        const proofHash = crypto.createHash('sha256').update(proofUrl + learnerAddress + Date.now()).digest('hex');

        const newSubmission = new Submission({
            taskId,
            learnerAddress,
            proofUrl,
            proofHash: '0x' + proofHash,
            status: 'pending'
        });
        await newSubmission.save();
        res.status(201).json(newSubmission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.verifySubmission = async (req, res) => {
    const { submissionId, status, skillName, level } = req.body;
    try {
        const submission = await Submission.findById(submissionId);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        if (status === 'approved' && !submission.mintedTokenId) {
            // Logic to mint NFT on-chain
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
        }

        submission.status = status;
        await submission.save();
        res.json(submission);
    } catch (error) {
        console.error("Minting error:", error);
        res.status(400).json({ message: error.message });
    }
};
