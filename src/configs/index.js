import morgan from 'morgan';
import bodyParser from 'body-parser';
import express from 'express';

export default function configs(app) {
   (() => {
      return {
         staticFile() {
            app.use(express.static('public'));
         },
         convertDataType() {
            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(bodyParser.json());
         },
         logger() {
            app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
         },
         setViewEngine() {
            app.set('view engine', 'ejs');
            app.set('views', './src/views');
         },
         run() {
            this.staticFile();
            this.convertDataType();
            this.logger();
            this.setViewEngine();
         },
      };
   })().run();
}
