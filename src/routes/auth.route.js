const express = require('express');
import authController from '../controllers/auth.controller';
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.delete('/logout', authController.logout);
router.post('/refresh-token', authController.getNewAccessToken);

export default router;
