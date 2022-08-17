import morgan from 'morgan';
import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import Redis from 'ioredis';
let RedisStore = require('connect-redis')(session);
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import userService from '../service/user.service';
const redisClient = new Redis();

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

            const JWTstrategy = new JwtStrategy(jwtOptions, (user, done) => {
               try {
                  done(null, user);
               } catch (error) {
                  console.log('message: ', error.message);
                  done(null, false);
               }
            });

            const localStraregy = new LocalStrategy(async (username, password, done) => {
               if (username && password) {
                  try {
                     const userInfo = await userService.login(username, password);
                     if (userInfo) {
                        return done(null, userInfo, { message: 'Logged in Successfully' });
                     } else {
                        done(null, 'null', { message: 'User not found' });
                     }
                  } catch (error) {
                     done(error, false, { message: 'select user at database occured error !' });
                  }
               } else {
                  done(null, false, {
                     message: 'Missing username or password !',
                  });
               }
            });

            passport.use(JWTstrategy);
            passport.use(localStraregy);

            app.use(passport.initialize());
            app.use(passport.authenticate('session'));

            passport.serializeUser(function (user, done) {
               process.nextTick(function () {
                  done(null, user);
               });
            });

            passport.deserializeUser((user, done) => {
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
