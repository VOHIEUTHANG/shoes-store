const mainController = () => ({
   getHomePage: (req, res) => {
      res.render('pages/home');
   },
   get404Page: (req, res) => {
      res.render('pages/404');
   },
   getLoginPage: (req, res) => {
      res.render('pages/login');
   },
});

export default mainController();
