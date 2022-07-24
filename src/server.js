import express from 'express';
import dotenv from 'dotenv';
import initWebRoutes from './routes';
import configs from './configs';
dotenv.config();

const app = express();
const port = process.env.PORT || 8017;

configs(app);
initWebRoutes(app);

app.listen(port, () => {
   console.log(`Starting server on http://localhost:${port}`);
});
