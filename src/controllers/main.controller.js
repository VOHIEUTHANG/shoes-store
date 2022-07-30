import { info } from 'node-sass';
import brandService from '../service/brand.service';
import categoryService from '../service/category.service';

const mainController = () => ({
   getHomePage: async (req, res) => {
      const user = req.user;
      const payloadInfo = req.payload;
      try {
         const payload = { user: {}, isLoggedIn: false, ...payloadInfo };
         if (user) {
            payload.user = user;
            payload.isLoggedIn = true;
         }
         res.render('pages/home', payload);
      } catch (error) {
         res.status(400).json({
            message: 'get brands of categorys list occured error !',
         });
      }
   },
   getLoginPage: (req, res) => {
      const user = req.user;
      const payloadInfo = req.payload;
      if (user) {
         res.redirect('/');
      } else {
         res.render('pages/login', { user: {}, isLoggedIn: false, ...payloadInfo });
      }
   },
   logout: (req, res) => {
      req.logout(function (err) {
         if (err) {
            return next(err);
         }
         res.redirect('/');
      });
   },
   getRegisterPage: (req, res) => {
      const user = req.user;
      if (user) {
         res.render('pages/register', { user, isLoggedIn: true });
      } else {
         res.render('pages/register', { user: {}, isLoggedIn: false });
      }
   },
   get404Page: (req, res) => {
      res.render('pages/404');
   },
});

export default mainController();
