const express = require('express');
const productController = require('../controllers/product.controller');
import { multipleFileUpload } from '../middlewares/uploadFiles';
import { signleFileUpload } from '../middlewares/uploadFiles';
import validateToken from '../middlewares/validateToken';
const router = express.Router();
router.get('/get', productController.get);
router.post('/create', multipleFileUpload('file'), productController.create);
router.post('/testUpload', multipleFileUpload('file'), (req, res) => {
   const file = req.files;
   console.log(req.body.id);
   if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      res.send('lỗi');
   }
   res.send(file);
});
router.post('/add-comment', validateToken, signleFileUpload('image'), productController.insertProductComment);
router.delete('/delete-comment/:commentID', validateToken, productController.deleteComment);
router.get('/delete');
router.post('/update', productController.update);
router.get('/', productController.getActiveProducts);
module.exports = router;
