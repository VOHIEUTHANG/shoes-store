const express = require('express');
import userController from '../controllers/user.controller';
const router = express.Router();
import headerWrapper from '../helpers/headerWrapper';

router.get('/login', headerWrapper(userController.getLoginPage));
router.get('/register', headerWrapper(userController.getRegisterPage));
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/refresh-token', userController.getNewAccessToken);
router.delete('/logout', userController.logout);

export default router;
