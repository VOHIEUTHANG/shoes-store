const express = require('express');
import authController from '../controllers/authController';
const router = express.Router();
import passport from 'passport';

// prefix: /api/v1/auth/

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

router.post(
   '/login',
   passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
   }),
   (req, res) => {
      console.log('req.user', usernam, req.user);
      console.log('session user', req.session.user);
   },
);
router.get('/profile', (req, res) => {
   console.log('isAuthenticated', req.isAuthenticated());
   console.log(req.user);
   console.log(req.username);
   // console.log('profile page ====>', req);
});

router.post('/register', authController.register);
router.delete('/logout', authController.logout);
router.post('/refresh-token', authController.getNewAccessToken);

router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
   console.log('user', req.user);
   const user = { name: 'ThangVo', age: '21' };
   res.json(user);
});

export default router;
