import express, { response } from 'express';
const router = express.Router();
import mainController from '../controllers/main.controller';
import validateTokenMiddleware from '../middlewares/validateToken';
import headerHOC from '../helpers/headerHOC';

router.get('/', headerHOC(mainController.getHomePage));
router.get('/login', headerHOC(mainController.getLoginPage));
router.get('/logout', mainController.logout);
router.get('/register', mainController.getRegisterPage);
router.get('/set-session', (req, res) => {
   req.session.user = {
      userName: 'ThangVo',
      age: 20,
      email: 'hieuthang369@gmail.com',
   };
   res.send('Ok');
});
router.get('/get-session', (req, res) => {
   res.send(req.session);
});
router.get('/protected', validateTokenMiddleware, (req, res) => {
   console.log(req.user);
   res.json(req.user);
});

export default router;
