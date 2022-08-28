import express from 'express';
import userController from '../controllers/user.controller';
import { signleFileUpload } from '../middlewares/uploadFiles';
import validateToken from '../middlewares/validateToken';
import headerWrapper from '../helpers/headerWrapper';

const router = express.Router();
// PUBLIC ROUTES --------------------------------
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/refresh-token', userController.getNewAccessToken);
router.delete('/logout', userController.logout);
router.get('/logout-backup', userController.logoutBackup);
// PRIVATE ROUTES ------------------------------
router.put('/update-info', validateToken, signleFileUpload('avatar'), userController.updateInfo);
router.put('/change-password', validateToken, userController.changePassword);
router.post('/add-to-wishlist/:productID', validateToken, userController.addToWishList);
router.delete('/delete-from-wishlist/:productID', validateToken, userController.deleteFromWishList);
router.delete('/delete-cart-item/:productItemID', validateToken, userController.deleteCartItem);
router.post('/add-to-cart', validateToken, userController.addCart);
router.patch('/edit-cart', validateToken, userController.editCart);
router.post('/add-address', validateToken, userController.addAddress);
router.delete('/delete-address/:addressID', validateToken, userController.deleteDeliveryAddress);
router.get('/address/:addressID', userController.getAddress);
router.put('/update-address', validateToken, userController.updateAddress);
router.post('/order', validateToken, headerWrapper(userController.createOrder));

export default router;
