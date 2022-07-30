import { info } from 'node-sass';
import brandService from '../service/brand.service';
import categoryService from '../service/category.service';

const mainController = () => ({
   getHomePage: async (req, res) => {
      const user = req.user;
      try {
         const brands = await brandService.getAllBrands();
         const categorys = await categoryService.getAllCategory();
         console.log(categorys);
         const brandNameList = brands.map((brand) => brand.brandName);
         const categoryNameList = categorys.map((category) => category.name);
         const payload = { user: {}, isLoggedIn: false, brandNameList, categoryNameList };
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
      if (user) {
         res.redirect('/');
      } else {
         res.render('pages/login', { user: {}, isLoggedIn: false });
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
