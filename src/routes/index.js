import mainRouter from "./main.route";

export default function initWebRoutes(app) {
  app.use("/", mainRouter);
}
