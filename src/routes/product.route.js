const express = require('express');
const route = express.Router();
const productDetailController = require('../controllers/product_detail.controller')
route.get('/detail',productDetailController.getInfo);
module.exports = route;