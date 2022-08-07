const express = require('express');
const productService = require('../service/product.service');
import categoryService from'../service/category.service';
import brandService from'../service/brand.service';
class adminController {
  async formProduct(req,res){
    const brandList= await brandService.getAllBrands();
    const categoryList = await categoryService.getAllCategory();
    const productList= await productService.getAllJoin();
    res.send(productList);
        //res.render('pages/CRUD-product',{brandList,categoryList,productList});
    }
}
module.exports= new adminController;