const express = require('express');
const jwt = require('jsonwebtoken');
const dotevn = require('dotenv');
const roleHandler = require('../utils/roleHandler');
dotevn.config();
class middleWare {
   checkCustomer(req, res, next) {
      try {
         var token = req.cookies.token;
         let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
         roleHandler.getRole(decoded.role_code).then((data) => {
            if (data[0].rolename == 'customer') next();
            else res.redirect('/login');
         });
      } catch (error) {
         if (error) throw error;
      }
   }
   checkEmployee(req, res, next) {
      try {
         var token = req.cookies.token;
         let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
         roleHandler.getRole(decoded.role_code).then((data) => {
            if (data[0].rolename == 'employee') next();
            else res.redirect('/login');
         });
      } catch (error) {
         if (error) throw error;
      }
   }
   checkAdmin(req, res, next) {
      try {
         var token = req.cookies.token;
         let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
         roleHandler.getRole(decoded.role_code).then((data) => {
            if (data[0].rolename == 'admin') next();
            else res.redirect('/login');
         });
      } catch (error) {
         if (error) throw error;
      }
   }
}
module.exports = new middleWare();
