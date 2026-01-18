const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    taskId: { type: Number, required: true },
    learnerAddress: { type: String, required: true },
    proofUrl: { type: String, required: true },
    proofHash: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    mintedTokenId: { type: Number },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
