import jwt from 'jsonwebtoken';

export default function validateTokenMiddleware(req, res, next) {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   if (!token) return res.status(401);
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403);
      req.user = user;
      next();
   });
}
