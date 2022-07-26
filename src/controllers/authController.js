import express from 'express';
import jwt from 'jsonwebtoken';
import authenService from '../service/auth.service';

const authenController = () => ({
  async  login(req, res, next) {
      const { userName, password } = req.body;
      if (userName && password)
      {  let acc = await authenService.login(userName, password);
         if (acc) {
            let options = {expiresIn: 60 * 60 };
                     let token = jwt.sign({username: acc.userName, role_code: acc.role_code},process.env.ACCESS_TOKEN_SECRET,options);
                     res.cookie('token', token, options);   
                     res.send({info: 'thành công'});        
         }
         else console.log('user name or pass incorrect')
        
      }
      else console.log('Missing userName of password !');
   },
});
  
export default authenController();
