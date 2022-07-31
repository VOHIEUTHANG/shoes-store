const express = require('express');
const sequenlize =require('../configs/connectSequelize');
const productModel = require('../models/product');
const {DataTypes }= require('sequelize');
class productDetailController {
   async getInfo(req,res){
    const category = productModel(sequenlize,DataTypes);
    const data= await category.findAll();
     res.send(data);
    }
}
module.exports = new productDetailController;