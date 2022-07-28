import morgan from 'morgan';
import bodyParser from 'body-parser';
import express from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const cookie_parser = require('cookie-parser');
export default function configs(app) {
   (() => {
      return {
         staticFile() {
            app.use(express.static('public'));
         },
         cookie() {
            app.use(cookie_parser());
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
         passport() {
            const jwtOptions = {};
            jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('Authorization');
            jwtOptions.secretOrKey = process.env.ACCESS_TOKEN_SECRET;
            var strategy = new JwtStrategy(jwtOptions, (payload, done) => {
               try {
                  console.log('payload >>', payload);
                  done(null, { userName: payload.userName });
               } catch (error) {}
            });
            passport.use(strategy);
            app.use(passport.initialize());
         },
         run() {
            this.staticFile();
            this.convertDataType();
            this.logger();
            this.setViewEngine();
            this.cookie();
            this.passport();
         },
      };
   })().run();
}
