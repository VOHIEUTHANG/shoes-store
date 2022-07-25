import express from 'express';
const router = express.Router();
import mainController from '../controllers/mainController';

router.get('/', mainController.getHomePage);
router.get('/login', mainController.getLoginPage);

export default router;
