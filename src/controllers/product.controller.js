import productService from '../service/product.service';
const product_itemService = require('../service/product_item.service');
const product_categoryService = require('../service/product_category.service');
const product_imagesService = require('../service/product_images.service');
const { ideahub_v1alpha } = require('googleapis');
class productController {
   async create(req, res) {
        res.send({'res': 'ok'});
      let product_itemList =JSON.parse(req.body.items);
      try {
         let product = await productService.save(req.body);
         req.files.forEach(element => {
          product_imagesService.save(product.dataValues.ID,`assets/uploads/${element.filename}`);
         });
         let product_category = await product_categoryService.save(product.dataValues.ID, req.body.category);
         for (let element of product_itemList) {
            await product_itemService.save(product.dataValues.ID, element.inventory, element.size);
         }
         res.status(200).json({
            title: 'success',
            message: 'Tạo thành công!',
         });
      } catch (error) {
         console.log(error);
         res.status(500).json({
            title: 'fail',
            message: 'Tạo thất bại!',
         });
      }
    }
   async getActiveProducts(req, res) {
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
   }
   async get(req,res){
      let id = req.param('id');
       Promise.all([productService.getOneJoin(id),product_itemService.getAllById(id)]).then((data)=>{
         res.status(200).json({product:data[0],product_item:data[1]});
       }).catch((error)=>{
         res.status(500).json({err: 'err'});
         console.log(error); 
       })
        
   }
   async update(req,res){
      let product_itemList = req.body.item;
       try {
         let product= await productService.update(req.body);
         let product_category = await product_categoryService.update(req.body.id, req.body.category);
         product_itemService.deleteByProductId(req.body.id);
         for (let element of product_itemList) {
            await product_itemService.update(req.body.id, element.size, element.inventory);
         }
         res.status(200).json({
            title: 'success',
            message: 'Sửa thành công!'
         });
       } catch (error) {
         res.status(500).json({
            title: 'fail',
            message: 'Sửa thất bại!',
         });
         console.log('🚀 ~ file: product.controller.js ~ method update ~ productController ~ error', error);
       }
    }
}
module.exports = new productController();
