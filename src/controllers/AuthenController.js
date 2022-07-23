const express = require('express');
const jwt = require('jsonwebtoken')
const AuthenService = require('../service/authen.service');
class AuthenController {
    CheckLogin(req,res,next){
       next();
    }
    Login(req,res,next){
        let username= req.body.username;
        let pass =req.body.pass; 
        AuthenService.Login(username,pass).then((data)=>{
            let options = {
                maxAge: 1000 * 60 * 15, // would expire after 15 minutes
            }
            let token = jwt.sign(data,'manhnenene');
            res.cookie('token',token,options);
            res.json({token});
        }).catch((err)=>{
            res.json({data:`${err}`});
        });
        //next();
    }
}
module.exports = new AuthenController;