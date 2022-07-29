const express = require('express');
import authController from '../controllers/authController';
const router = express.Router();
import passport from 'passport';
import { Router } from 'express';

// prefix: /api/v1/auth/
router.post('/login', authController.login);
router.post('/register', authController.register);
router.delete('/logout', authController.logout);
router.post('/token', authController.getNewAccessToken);

router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
   console.log('user', req.user);
   const user = { name: 'ThangVo', age: '21' };
   res.json(user);
});

export default router;
