import { response } from 'express';
import formatPath from '../helpers/pathFormated';
import { createResponse } from '../helpers/responseCreator';
import productService from '../service/product.service';
const product_itemService = require('../service/product_item.service');
const product_categoryService = require('../service/product_category.service');
const product_imagesService = require('../service/product_images.service');
class productController {
   async create(req, res) {
      let product_itemList = JSON.parse(req.body.items);
      try {
         let product = await productService.save(req.body);
         if (product) {
            req.files.forEach((element) => {
               product_imagesService.save(product.dataValues.ID, `/assets/uploads/${element.filename}`);
            });
            let product_category = await product_categoryService.save(product.dataValues.ID, req.body.category);
            for (let element of product_itemList) {
               await product_itemService.save(product.dataValues.ID, element.size, element.inventory);
            }
            res.status(200).json({
               title: 'success',
               message: 'Tạo thành công!',
            });
         } else {
            return res.json(createResponse('error', 'Không thể thêm sản phẩm !'));
         }
      } catch (error) {
         console.log(error);
         res.status(500).json({
            title: 'fail',
            message: 'Tạo thất bại!',
         });
      }
   }
   async insertProductComment(req, res) {
      const image = req.file;
      const username = req.user.userName;
      let { comment, productID } = req.body;
      const payloadData = {
         userName: username,
         productID,
         content: comment,
      };
      if (!!image) {
         const path = formatPath(image);
         payloadData.imageURL = path;
      }
      const commentID = await productService.insertProductComment(payloadData);
      return commentID
         ? res.json(
              JSON.stringify(
                 createResponse('success', 'Thêm đánh giá cho sản phẩm thành công !', {
                    content: payloadData.content,
                    image: payloadData?.imageURL,
                    id: commentID,
                 }),
              ),
           )
         : res.json(createResponse('error', 'Xảy ra lỗi khi thêm đánh giá cho sản phẩm thất bại !'));
   }
   async deleteComment(req, res) {
      const username = req.user?.userName;
      const commentID = req.params.commentID;
      if (commentID) {
         const deleteResult = await productService.deleteCommentByID(commentID, username);
         if (deleteResult) {
            res.json(createResponse('success', 'Xóa bình luận thành công !'));
         } else {
            res.json(createResponse('error', 'Xóa bình luận xảy ra lỗi !'));
         }
      } else {
         return res.json(createResponse('error', 'Missing comment ID !'));
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
   async get(req, res) {
      let id = req.param('id');
      Promise.all([productService.getOneJoin(id), product_itemService.getAllById(id)])
         .then((data) => {
            res.status(200).json({ product: data[0], product_item: data[1] });
         })
         .catch((error) => {
            res.status(500).json({ err: 'err' });
            console.log(error);
         });
   }
   async update(req, res) {
      let product_itemList = JSON.parse(req.body.items);
      let category_List =JSON.parse(req.body.category);
      try {
         let product = await productService.update(req.body);
         let deleteCategory = await product_categoryService.deleteByProductId(req.body.id);
         for ( let element of category_List){
            let product_category = await product_categoryService.update(req.body.id, element);
         }
        for (let element of product_itemList) {
            await product_itemService.update(element.id, element.size, element.inventory,req.body.id);
        }
         req.files.forEach((element) => {
            product_imagesService.save(req.body.id, `/assets/uploads/${element.filename}`);
         });
         res.status(200).json({
            title: 'Thông báo',
            message: 'Sửa thành công!',
         });
      } catch (error) {
         res.status(500).json({
            title: 'Thông báo',
            message: 'Sửa thất bại!',
         });
         console.log('🚀 ~ file: product.controller.js ~ method update ~ productController ~ error', error);
      }
   }
   async getNumProduct(req,res){
      let limit =8;
      let numProduct = await productService.countProduct();
      res.status(200).json({num: Math.ceil(numProduct/limit)});
   }
}
module.exports = new productController();
