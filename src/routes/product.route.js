const express = require('express');
const productController = require('../controllers/product.controller');
import { createResponse } from '../helpers/responseCreator';
import productService from '../service/product.service';
const router = express.Router();
router.post('/create', productController.create);
router.get('/delete');
router.get('/update');
router.get('/', async (req, res) => {
   const pageNumber = req.query.page;
   const limit = req.query.limit || 5;

   try {
      const productResult = await productService.getActiveProduct({
         offset: (Number(pageNumber) - 1) * Number(limit),
         limit: Number(limit),
      });
      res.json(productResult);
   } catch (error) {
      console.log(error);
      res.json(createResponse('error', 'failed to get active product !'));
   }
});

module.exports = router;
