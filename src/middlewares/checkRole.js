const express = require('express');
const passport = require('passport');
const dotevn = require('dotenv');
const roleService = require('../service/role.service');
export default (permissions) => {
   return async (req, res, next) => {
      passport.authenticate('local', { failureRedirect: '/login' }, async (err, user) => {
         if (req.user) {
            let roleCode = req.user.permissionCode;
            let roleName = await roleService.getRole(roleCode);
            if (permissions.includes(roleName)) next();
            else {
               res.redirect('/login');
            }
         } else {
            res.redirect('/login');
         }
      })(req, res, next);
   };
};
