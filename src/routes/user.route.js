import express from 'express';
import userController from '../controllers/user.controller';
import { signleFileUpload } from '../middlewares/uploadFiles';
import validateToken from '../middlewares/validateToken';

const router = express.Router();
// PUBLIC ROUTES --------------------------------
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/refresh-token', userController.getNewAccessToken);
router.delete('/logout', userController.logout);
// PRIVATE ROUTES ------------------------------
router.put('/update-info', validateToken, signleFileUpload('avatar'), userController.updateInfo);
router.put('/change-password', validateToken, userController.changePassword);
router.post('/add-to-wishlist/:productID', validateToken, userController.addToWishList);
router.delete('/delete-from-wishlist/:productID', validateToken, userController.deleteFromWishList);

export default router;
