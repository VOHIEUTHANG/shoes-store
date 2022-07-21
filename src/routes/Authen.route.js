const express = require('express');
const AuthenController = require('../controllers/AuthenController');
const router = express.Router();
router.post('/login',AuthenController.Login);
module.exports = router;