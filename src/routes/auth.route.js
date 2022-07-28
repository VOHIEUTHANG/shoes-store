const express = require('express');
import authController from '../controllers/authController';
const router = express.Router();

// prefix: /api/v1/auth/
router.post('/login', authController.login);
router.post('/register', authController.register);
router.delete('/logout', authController.logout);
router.post('/token', authController.getNewAccessToken);

export default router;
