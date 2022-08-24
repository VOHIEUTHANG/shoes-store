const express= require('express');
const product_imagesService = require('../service/product_images.service');
class product_imgController{
    async get(req,res){
        let id= req.param('id');
        let img=  await product_imagesService.get(id)
        res.send(img);
    }
    async delete(req,res){
        let url = req.body.url;
        product_imagesService.delete(url)
        .then(()=>{
            res.status(200).send({content:'Thành công'});
        })
        .catch((err)=>{
            res.status(500).json({content:'Lỗi server'});
        })
    }
}
module.exports= new product_imgController