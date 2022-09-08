const express = require('express');
const adminController = require('../controllers/admin.controller');
import validateToken from '../middlewares/validateToken';
const route =express.Router();
route.get('/Manage/product',adminController.productPage);
route.get('/Manage/brand',adminController.brandPage);
route.get('/Manage/feedback',adminController.productPage);
route.get('/Manage/user',adminController.productPage);
route.get('/Manage/order',adminController.productPage);
route.get('/Manage/category',adminController.brandPage);
route.get('/',adminController.homePage)
module.exports = route;