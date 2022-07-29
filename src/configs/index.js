import morgan from 'morgan';
import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import Redis from 'ioredis';
let RedisStore = require('connect-redis')(session);

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
const redisClient = new Redis();

import authService from '../service/auth.service';

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
            // app.set('trust proxy', 1);
            app.use(
               session({
                  secret: 'keyboard cat',
                  store: new RedisStore({ client: redisClient }),
                  resave: false,
                  saveUninitialized: true,
                  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
               }),
            );
         },
         passport() {
            const jwtOptions = {};
            jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('Authorization');
            jwtOptions.secretOrKey = process.env.ACCESS_TOKEN_SECRET;
            const JWTstrategy = new JwtStrategy(jwtOptions, (payload, done) => {
               try {
                  console.log('payload >>', payload);
                  done(null, { userName: payload.userName });
               } catch (error) {}
            });
            const localStraregy = new LocalStrategy((username, password, done) => {
               console.log('username', username);
               if (username === 'admin' && password === '123') {
                  return done(null, { username });
               }
               done(null, false);
            });

            passport.use(JWTstrategy);
            passport.use(localStraregy);

            app.use(passport.initialize());
            app.use(passport.authenticate('session'));

            passport.serializeUser(function (user, done) {
               console.log('🚀 ~ file: index.js ~ line 68 ~ user', user);
               process.nextTick(function () {
                  done(null, user);
               });
            });

            passport.deserializeUser(function (user, done) {
               console.log('user', user);
               process.nextTick(function () {
                  return done(null, user);
               });
            });
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
