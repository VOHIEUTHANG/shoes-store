const express = require('express');
const product_imgController= require('../controllers/product_img.controller')
const router = express.Router();
router.get('/get',product_imgController.get);
router.delete('/delete',product_imgController.delete)
module.exports = router;