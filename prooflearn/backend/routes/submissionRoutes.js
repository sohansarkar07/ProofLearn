const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

router.get('/', submissionController.getSubmissions);
router.post('/', submissionController.submitTask);
router.patch('/verify', submissionController.verifySubmission);

module.exports = router;
