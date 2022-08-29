const express = require('express');
const productService = require('../service/product.service');
import categoryService from '../service/category.service';
import brandService from '../service/brand.service';
import formatToCurrency from '../helpers/formatCurrency';
class adminController {
   async formProduct(req, res) {
      let user= req.userInfo;
      Promise.all([brandService.getAllBrands(), categoryService.getAllCategory(), productService.getAllJoin()])
         .then((data) => {
            let brandList = data[0];
            let categoryList = data[1];
            let productList = data[2];
            productList.forEach(element => {
               element.price=formatToCurrency(element.price * 1000)
            });
           res.render('pages/admin-pages/Manage-product', { user,brandList, categoryList, productList });
         })
         .catch((err) => {
            console.log('🚀 ~ file: admin.controller.js ~ method formProduct ~ adminController ~ error', err);
         });
   }
   homePage(req, res) {
      let user= req.userInfo;  
      res.render('pages/admin-pages/admin-home-page',{user});
   }
}
module.exports = new adminController();
