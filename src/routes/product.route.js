const express = require('express');
const productController = require('../controllers/product.controller');
import { createResponse } from '../helpers/responseCreator';
const router = express.Router();
router.post('/create', productController.create);
router.get('/delete');
router.get('/update');
router.get('/', productController.getActiveProducts);

module.exports = router;
