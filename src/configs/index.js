import morgan from 'morgan';
import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import Redis from 'ioredis';
let RedisStore = require('connect-redis')(session);
const redisClient = new Redis();

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

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
         expressSession() {
            app.set('trust proxy', 1);
            app.use(
               session({
                  secret: 'keyboard cat',
                  store: new RedisStore({ client: redisClient }),
                  resave: false,
                  saveUninitialized: true,
                  cookie: { secure: false, httpOnly: true, maxAge: 5 * 60 * 1000 },
               }),
            );
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
            this.expressSession();
            this.passport();
         },
      };
   })().run();
}
