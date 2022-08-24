import mainController from '../controllers/main.controller';
import mainRouter from './main.route';
import userRoute from './user.route';
import accountRoute from './account.route';
import adminRoute from './admin.route';
import productRoute from './product.route';
import product_images from './product_img.route';
export default function initWebRoutes(app) {
   app.use('/api/user/', userRoute);
   app.use('/api/account/', accountRoute);
   app.use('/api/product/', productRoute);
   app.use('/admin/', adminRoute);
   app.use('/api/product_img/', product_images);
   app.use('/', mainRouter);
   app.use(mainController.get404Page);
}
