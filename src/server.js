import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import initWebRoutes from './routes';
dotenv.config();

const app = express();

// app.use(morgan("combined"));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './src/views');

const port = process.env.PORT || 8017;


initWebRoutes(app);
app.get('/', (req, res) => {
   res.render('pages/home');
});

// app.use((req, res) => {
//   res.render("pages/404");
// });

app.listen(port, () => {
   console.log(`Starting server on http://127.0.0.1:${port}`);
});
