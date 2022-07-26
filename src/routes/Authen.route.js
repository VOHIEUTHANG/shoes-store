const express = require('express');
import authController from '../controllers/authController';

const router = express.Router();
router.post('/login',authController.login);
export default router;
