const express = require('express');
import authController from '../controllers/authController';
const router = express.Router();
import passport from 'passport';

import authService from '../service/auth.service';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../helpers/tokenHandler';

import { ExtractJwt } from 'passport-jwt';

// router.post('/login', authController.login);

// router.post(
//    '/login',
//    passport.authenticate('local', {
//       successRedirect: '/',
//       failureRedirect: '/login',
//    }),
//    (req, res) => {
//       console.log(req);
//    },
// );

router.post('/login', async (req, res, next) => {
   passport.authenticate('local', async (err, user, message) => {
      try {
         if (err || !user) {
            const error = new Error('An error occurred.');
            return next(error);
         }
         req.login(user, { session: false }, async (error) => {
            if (error) return next(error);
            const accessToken = generateAccessToken({ username });
            const refreshToken = generateRefreshToken({ username });
            const insertRefreshTokenResult = await authService.insertRefreshTokens(refreshToken, username);
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
         });
      } catch (error) {
         return next(error);
      }
   })(req, res, next);
});

router.get('/profile', (req, res) => {
   console.log('isAuthenticated', req.isAuthenticated());
   console.log(req.user);
   console.log(req.username);
   // console.log('profile page ====>', req);
});

router.post('/register', authController.register);
router.delete('/logout', authController.logout);
router.post('/refresh-token', authController.getNewAccessToken);

export default router;
