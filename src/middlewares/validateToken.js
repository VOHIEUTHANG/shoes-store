import jwt from 'jsonwebtoken';

export default function validateTokenMiddleware(req, res, next) {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   if (!token) res.status(401);
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) res.status(403).json({ status: 403, message: err.message });
      req.user = user;
      next();
   });
}
