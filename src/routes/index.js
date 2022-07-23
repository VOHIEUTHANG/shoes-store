import mainRouter from './main.route';
import mainController from '../controllers/mainController';
// const Authenroute = require('./Authen.route')
export default function initWebRoutes(app) {
   // app.use('/api/Authen/',Authenroute)
   app.use('/', mainRouter);
   app.use(mainController.get404Page);
}
