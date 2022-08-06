import express from 'express';
import userController from '../controllers/user.controller';
import { signleFileUpload } from '../middlewares/uploadFiles';
import validateToken from '../middlewares/validateToken';

const router = express.Router();
// PUBLIC ROUTE
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/refresh-token', userController.getNewAccessToken);
router.delete('/logout', userController.logout);
// PRIVATE ROUTE
router.put('/update-info', validateToken, signleFileUpload('avatar'), userController.updateInfo);

export default router;
