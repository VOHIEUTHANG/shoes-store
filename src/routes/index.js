import mainRouter from './main.route';
import mainController from '../controllers/mainController';
import authRoute from './auth.route';

export default function initWebRoutes(app) {
   app.use('/api/v1/auth/', authRoute);
   app.use('/', mainRouter);
   app.use(mainController.get404Page);
}
