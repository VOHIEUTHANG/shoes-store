const homeController = () => {
  return {
    getHomePage: (req, res) => {
      res.render("pages/home");
    },
  };
};

export default homeController();
