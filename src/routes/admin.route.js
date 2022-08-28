const express = require('express');
const adminController = require('../controllers/admin.controller');
import validateToken from '../middlewares/validateToken';
const route =express.Router();
route.get('/Manage/product',adminController.formProduct);
route.get('/',adminController.homePage)
module.exports = route;