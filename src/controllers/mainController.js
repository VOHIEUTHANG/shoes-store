const mainController = () => ({
   getHomePage: (req, res) => {
      const user = req.user;
      if (user) {
         res.render('pages/home', { user, isLoggedIn: true });
      } else {
         res.render('pages/home', { user: {}, isLoggedIn: false });
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
