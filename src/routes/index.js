import mainRouter from './main.route';
import mainController from '../controllers/main.controller';
import userRoute from './user.route';

import express from 'express';
export default function initWebRoutes(app) {
   app.use('/api/user/', userRoute);
   app.use('/', mainRouter);
   app.use(mainController.get404Page);
}
