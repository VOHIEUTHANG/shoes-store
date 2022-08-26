import passport from 'passport';
import { createResponse } from '../helpers/responseCreator';

export default function validateTokenMiddleware(req, res, next) {
   passport.authenticate('jwt', { session: false }, (error, user, info, status) => {
      console.log('[Check token] : error ==> ', error);
      console.log('Current user ===> ', user);
      if (!user) {
         if (info?.message === 'No auth token') {
            return res.status(401).json(createResponse('warning', info.message));
         }
         if (info?.message === 'jwt expired') {
            return res.status(403).json(createResponse('warning', info.message));
         }
         return res.status(400).json(createResponse('error', 'Invalide token'));
      } else {
         req.user = user;
         next();
      }
   })(req, res, next);
}
