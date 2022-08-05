const express = require('express');
const productService = require('../service/product.service');
const product_itemService = require('../service/product_item.service');
class productController{
   async create(req,res){
      const product_itemList= req.body.data;
         try {  
            const product=  await productService.save(req.body);
            for (const element of product_itemList) {
               console.log(element);
              await product_itemService.save(product.dataValues.ID,element.inputInventory,element.inputSize);
            } 
             res.status(200).json({
               title: 'success',
               message: 'Tạo thành công!'
            });
          
         } catch (error) {
            console.log(error);
            res.status(500).json({
               title: 'fail',
               message: 'Tạo thất bại!'
            });
         }
   }
}
module.exports = new productController;