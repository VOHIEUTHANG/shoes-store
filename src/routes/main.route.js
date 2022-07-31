import express, { response } from 'express';
const router = express.Router();
import mainController from '../controllers/main.controller';
import headerWrapper from '../helpers/headerWrapper';

router.get('/', headerWrapper(mainController.getHomePage));

export default router;
