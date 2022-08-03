const express = require('express');
const adminController = require('../controllers/admin.controller');
const route =express.Router();
route.get('/CRUD/product',adminController.formProduct)
module.exports = route;