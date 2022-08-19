const express = require('express');
const adminController = require('../controllers/admin.controller');
import validateToken from '../middlewares/validateToken';
import checkRole from '../middlewares/checkRole';
const route =express.Router();
route.get('/CRUD/product',adminController.formProduct);
route.get('/',checkRole(['admin']),(req,res)=>{
    const user = req.user;
    console.log(user);
    res.render('pages/admin-home-page')
})
module.exports = route;