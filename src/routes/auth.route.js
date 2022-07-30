const express = require('express');
import authController from '../controllers/authController';
const router = express.Router();
import passport from 'passport';

import authService from '../service/auth.service';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../helpers/tokenHandler';
import { ExtractJwt } from 'passport-jwt';

router.post('/login', async (req, res, next) => {
   passport.authenticate('local', async (err, user, info) => {
      try {
         if (!err && user === 'null') {
            return res.status(200).json({
               title: 'error',
               message: 'Tên đăng nhập hoặc mật khẩu không đúng !',
            });
         }
         if (err || user === false) {
            const error = new Error('An error occurred.');
            return next(error);
         }
         req.login(user, { session: true }, async (error) => {
            if (error) return next(error);
            if (!!user) {
               const accessToken = generateAccessToken(user);
               const refreshToken = generateRefreshToken(user);
               const insertRefreshTokenResult = await authService.insertRefreshTokens(refreshToken, user.userName);
               if (insertRefreshTokenResult) {
                  res.status(200).json({
                     title: 'success',
                     message: 'Đăng nhập thành công !',
                     payload: { accessToken, refreshToken },
                  });
               } else {
                  res.status(200).json({
                     title: 'error',
                     message: 'Insert refresh token failed',
                  });
               }
            }
         });
      } catch (error) {
         return next(error);
      }
   })(req, res, next);
});

router.get('/profile', (req, res) => {
   console.log('isAuthenticated', req.isAuthenticated());
   console.log('user login info', req.user);
});

router.post('/register', authController.register);
router.delete('/logout', authController.logout);
router.post('/refresh-token', authController.getNewAccessToken);

export default router;
