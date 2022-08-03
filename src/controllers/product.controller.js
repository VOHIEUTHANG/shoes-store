const express = require('express');
const productService = require('../service/product.service');
class productController{
   async create(req,res){
   const product=  await productService.save(req.body);
   console.log(product);
    res.status(200).json({
      title: 'success',
      message: 'Tạo thành công!'
   });
   }
}
module.exports = new productController;