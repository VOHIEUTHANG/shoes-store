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
   get404Page: (req, res) => {
      res.render('pages/404');
   },
});

export default mainController();
