const express = require('express');
import userService from'../service/user.service';
export default  function headerAdmin(req,res,next){
        let userName = req.user.userName;
        userService.getUserInfo(userName).then((data)=>{
            let userInfo= {name:data.fullName, avatar:data.avatar};
            req.userInfo= userInfo;
            next();
        })   
};