const express = require('express');
const productService = require('../service/product.service');
import categoryService from'../service/category.service';
import brandService from'../service/brand.service';
class adminController {
  async formProduct(req,res){
    Promise.all([brandService.getAllBrands(),categoryService.getAllCategory(),productService.getAllJoin()]).then((data)=>{
      let brandList= data[0];
      let categoryList = data[1];
      let productList= data[2];
      res.render('pages/CRUD-product',{brandList,categoryList,productList});
    })
    .catch((err)=>{
      console.log('🚀 ~ file: admin.controller.js ~ method formProduct ~ adminController ~ error', err)
    })  
     }
}
module.exports= new adminController;