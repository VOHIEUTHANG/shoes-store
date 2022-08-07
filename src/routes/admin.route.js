const express = require('express');
const adminController = require('../controllers/admin.controller');
const route =express.Router();
route.get('/CRUD/product',adminController.formProduct);
route.get('/',(req,res)=>{
    res.render('pages/admin-home-page')
})
module.exports = route;