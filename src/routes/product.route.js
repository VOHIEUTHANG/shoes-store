const express = require('express');
const productController = require('../controllers/product.controller');
import { createResponse } from '../helpers/responseCreator';
import { multipleFileUpload } from '../middlewares/uploadFiles'
const router = express.Router();
router.get('/get',productController.get)
router.post('/create',multipleFileUpload('file'),productController.create);
router.post('/testUpload',multipleFileUpload('file'),(req,res)=>{
  const file = req.files
  console.log(req.body.id);
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400;
    res.send('lỗi')
  }
  res.send(file);
})
router.get('/delete');
router.post('/update',productController.update)
router.get('/', productController.getActiveProducts);
module.exports = router;
