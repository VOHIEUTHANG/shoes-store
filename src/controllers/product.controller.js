const express = require('express');
const productService = require('../service/product.service');
const product_itemService = require('../service/product_item.service');
const product_categoryService = require('../service/product_category.service');
const { ideahub_v1alpha } = require('googleapis');

class productController{
   async create(req,res){
      let product_itemList= req.body.data;
      
         try {  
            let product=  await productService.save(req.body);
            let product_category = await product_categoryService.save(product.dataValues.ID,req.body.category);
            for (let element of product_itemList) {
              await product_itemService.save(product.dataValues.ID,element.inputInventory,element.inputSize);
            } 
             res.status(200).json({
               title: 'success',
               message: 'Tạo thành công!'
            });
          
         } catch (error) {
         console.log('🚀 ~ file: product.controller.js ~ method create ~ productController ~ error', err);
            res.status(500).json({
               title: 'fail',
               message: 'Tạo thất bại!'
            });
         }
      }
   async get(req,res){
      let id = req.param('id');
      try {
         let product= await productService.getOneJoin(id);
         res.status(200).json(product);
      } catch (err) {
         res.status(500).json({err: 'err'});
         console.log(err);
      }
   }
   async update(req,res){
       try {
         let product= await productService.update(req.body);
         console.log(product);
         res.status(200).json({
            title: 'success',
            message: 'Sửa thành công!'
         });
       } catch (error) {
         console.log('🚀 ~ file: product.controller.js ~ method update ~ productController ~ error', err);
       }
    }
   }
module.exports = new productController();
