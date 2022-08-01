import mainController from '../controllers/main.controller';
import mainRouter from './main.route';
import userRoute from './user.route';
import accountRoute from './account.route';
import wishListRoute from './wishlist.route';

export default function initWebRoutes(app) {
   app.use('/api/user/', userRoute);
   app.use('/api/account/', accountRoute);
   app.use('/api/wishlist/', wishListRoute);
   app.use('/', mainRouter);
   app.use(mainController.get404Page);
}
