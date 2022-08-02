import express, { response } from 'express';
const router = express.Router();
import mainController from '../controllers/main.controller';
import headerWrapper from '../helpers/headerWrapper';

router.get('/login', headerWrapper(mainController.getLoginPage));
router.get('/all-product', headerWrapper(mainController.getAllProductPage));
router.get('/register', headerWrapper(mainController.getRegisterPage));
router.get('/wishlist', headerWrapper(mainController.getWishListPage));
router.get('/cart', headerWrapper(mainController.getCartPage));
router.get('/', headerWrapper(mainController.getHomePage));

export default router;
