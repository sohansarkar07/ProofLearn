const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.loginOrRegister);
router.get('/:address', userController.getUserProfile);

module.exports = router;
