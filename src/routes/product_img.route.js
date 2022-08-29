const express = require('express');
const product_imgController= require('../controllers/product_img.controller');
import checkRole from '../middlewares/checkRole';
const router = express.Router();
router.get('/get',product_imgController.get);
router.delete('/delete',checkRole(['admin']),product_imgController.delete)
module.exports = router;