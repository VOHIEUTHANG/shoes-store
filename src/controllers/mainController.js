const mainController = () => ({
   getHomePage: (req, res) => {
      res.render('pages/home');
   },
   getLoginPage: (req, res) => {
      res.render('pages/login');
   },
   getSignUpPage: (req, res) => {
      res.render('pages/signup');
   },
   get404Page: (req, res) => {
      res.render('pages/404');
   },
});

export default mainController();
