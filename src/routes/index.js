import mainController from '../controllers/main.controller';
import mainRouter from './main.route';
import userRoute from './user.route';
import accountRoute from './account.route';
import wishListRoute from './wishlist.route';
import adminRoute from './admin.route';
import productRoute from './product.route';
export default function initWebRoutes(app) {
   app.use('/api/user/', userRoute);
   app.use('/api/account/', accountRoute);
   app.use('/api/wishlist/', wishListRoute);
   app.use('/api/product/',productRoute);
   app.use('/admin/',adminRoute);
   app.use('/', mainRouter);
   app.use(mainController.get404Page);
}
