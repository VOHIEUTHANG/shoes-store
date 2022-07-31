import mainRouter from './main.route';
import mainController from '../controllers/main.controller';
import userRoute from './user.route';
import product from './product.route';
import express from 'express';
export default function initWebRoutes(app) {
   app.use('/api/user/', userRoute);
   app.use('/product/',product)
   app.use('/', mainRouter);
   app.use(mainController.get404Page);
}
