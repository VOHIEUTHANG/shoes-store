import mainRouter from "./main.route";
const Authenroute = require('./Authen.route')
export default function initWebRoutes(app) {
  app.use('/api/Authen/',Authenroute)
  app.use("/", mainRouter);
}
