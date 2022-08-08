import express, { response } from 'express';
const router = express.Router();
import mainController from '../controllers/main.controller';
import headerWrapper from '../helpers/headerWrapper';
import validateToken from '../middlewares/validateToken';

router.get('/profile', headerWrapper(mainController.getProfilePage));
router.get('/purchase-order', headerWrapper(mainController.gePurchaseOrderPage));
router.get('/product-details/:slug', headerWrapper(mainController.getProductDetailsPage));
router.get('/all-product', headerWrapper(mainController.getAllProductPage));
router.get('/login', headerWrapper(mainController.getLoginPage));
router.get('/register', headerWrapper(mainController.getRegisterPage));
router.get('/wishlist', headerWrapper(mainController.getWishListPage));
router.get('/cart', headerWrapper(mainController.getCartPage));
router.get('/change-password', headerWrapper(mainController.getChangePasswordPage));

router.get('/403', mainController.get403Page);
router.get('/401', mainController.get401Page);
router.get('/404', mainController.get404Page);

router.get('/', headerWrapper(mainController.getHomePage));

export default router;
