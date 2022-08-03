const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();
router.post('/create',productController.create);
router.get('/delete',);
router.get('/update',)

module.exports = router;