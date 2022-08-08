import UserService from '../service/user.service';

const mainController = () => ({
   getHomePage: async (req, res) => {
      const user = req.user;
      const payloadInfo = req.payload;
      const payload = { user: {}, isLoggedIn: false, ...payloadInfo };
      if (user) {
         payload.user = user;
         payload.isLoggedIn = true;
      }
      res.render('pages/home', payload);
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
   getRegisterPage: (req, res) => {
      const user = req.user;
      const payloadInfo = req.payload;
      if (user) {
         res.redirect('/');
      } else {
         res.render('pages/register', { user: {}, isLoggedIn: false, ...payloadInfo });
      }
   },
   getWishListPage: (req, res) => {
      const user = req.user;
      const payloadInfo = req.payload;
      const payload = { user: {}, isLoggedIn: false, ...payloadInfo };
      if (!user) return res.redirect('/');
      payload.user = user;
      payload.isLoggedIn = true;
      res.render('pages/user-pages/wishlist', payload);
   },
   getCartPage: (req, res) => {
      const user = req.user;
      const payloadInfo = req.payload;
      const payload = { user: {}, isLoggedIn: false, ...payloadInfo };
      if (user) {
         payload.user = user;
         payload.isLoggedIn = true;
      }
      res.render('pages/user-pages/cart', payload);
   },
   get404Page: (req, res) => {
      res.render('pages/error-pages/404');
   },
   get403Page: (req, res) => {
      res.render('pages/error-pages/403');
   },
   get401Page: (req, res) => {
      res.render('pages/error-pages/401');
   },
   getAllProductPage: (req, res) => {
      const user = req.user;
      const payloadInfo = req.payload;
      const payload = { user: {}, isLoggedIn: false, ...payloadInfo };
      if (user) {
         payload.user = user;
         payload.isLoggedIn = true;
      }
      res.render('pages/all-product', payload);
   },
   getProductDetailsPage: (req, res) => {
      const { slug } = req.params;
      const user = req.user;
      const payloadInfo = req.payload;
      const payload = { user: {}, isLoggedIn: false, ...payloadInfo };
      if (user) {
         payload.user = user;
         payload.isLoggedIn = true;
      }
      res.render('pages/product-detail', payload);
   },
   getProfilePage: async (req, res) => {
      const user = req.user;
      if (!user) return res.redirect('/login');
      const userInfo = await UserService.getUserInfo(user.userName);
      user.avatar = userInfo.avatar;
      const payloadInfo = req.payload;
      const payload = { user, isLoggedIn: true, userInfo, ...payloadInfo };
      res.render('pages/user-pages/profile', payload);
   },
   getChangePasswordPage: async (req, res) => {
      const user = req.user;
      if (!user) return res.redirect('/');
      const payloadInfo = req.payload;
      const payload = { user: {}, isLoggedIn: false, ...payloadInfo };
      payload.user = user;
      payload.isLoggedIn = true;
      res.render('pages/user-pages/change-password', payload);
   },
   gePurchaseOrderPage: async (req, res) => {
      const user = req.user;
      if (!user) return res.redirect('/');
      const payloadInfo = req.payload;
      const payload = { user: {}, isLoggedIn: false, ...payloadInfo };
      payload.user = user;
      payload.isLoggedIn = true;
      res.render('pages/user-pages/purchase-order', payload);
   },
});

export default mainController();
