const express = require('express');
import authController from '../controllers/authController';
const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.delete('/logout', authController.logout);
router.post('/token', authController.getNewAccessToken);

const router = express.Router();
router.post('/login',authController.login);
export default router;
