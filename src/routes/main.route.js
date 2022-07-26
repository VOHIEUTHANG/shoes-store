import express from 'express';
const router = express.Router();
import mainController from '../controllers/mainController';

router.get('/', mainController.getHomePage);
router.get('/login', mainController.getLoginPage);
router.get('/signup', mainController.getSignUpPage);

export default router;
