import express from 'express';
import userController from '../controllers/user.controller';
import headerWrapper from '../helpers/headerWrapper';
const router = express.Router();

router.get('/login', headerWrapper(userController.getLoginPage));
router.get('/register', headerWrapper(userController.getRegisterPage));
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/refresh-token', userController.getNewAccessToken);
router.delete('/logout', userController.logout);

export default router;
