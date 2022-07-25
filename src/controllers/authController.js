import express from 'express';
import jwt from 'jsonwebtoken';
import authenService from '../service/authen.service';

const authenController = () => ({
   login(req, res, next) {
      const { userName, password } = req.body;
      if (userName && password) authenService.login(userName, password);
      else console.log('Missing userName of password !');

      // authenService.Login(username, pass)
      //    .then((data) => {
      //       let options = {
      //          maxAge: 1000 * 60 * 15, // would expire after 15 minutes
      //       };
      //       let token = jwt.sign(data, 'manhnenene');
      //       res.cookie('token', token, options);

      //       res.json({ token });
      //    })
      //    .catch((err) => {
      //       res.json({ data: `${err}` });
      //    });
      next();
   },
});

export default authenController();
