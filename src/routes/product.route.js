const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();
router.post('/create',productController.create);
router.get('/get',productController.get)
router.post('/update',productController.update)

module.exports = router;