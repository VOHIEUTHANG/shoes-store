const express= require('express');
const product_imagesService = require('../service/product_images.service');
class product_imgController{
    async get(req,res){
        let id= req.param('id');
        let img=  await product_imagesService.get(id)
        res.send(img);
    }
}
module.exports= new product_imgController