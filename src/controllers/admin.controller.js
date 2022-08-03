const express = require('express');
const productService = require('../service/product.service');
class adminController {
   formProduct(req,res){
        res.render('pages/CRUDProduct');
    }
}
module.exports= new adminController;