import authService from '../service/auth.service';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenHandler';

const authenController = () => ({
   async login(req, res, next) {
      const { userName, password } = req.body;
      if (userName && password) {
         const acc = await authService.login(userName, password);
         if (acc) {
            const options = {
               maxAge: 1000 * 60 * 15, // would expire after 15 minutes
            };
            const accessToken = generateAccessToken({ userName });
            const refreshToken = generateRefreshToken({ userName });

            res.cookie('token', accessToken, options);
            res.send({ info: 'thành công', accessToken, refreshToken });
         } else console.log('User name or pass is incorrect !');
      } else console.log('Missing userName of password !');
   },
   async getNewAccessToken(req, res, next) {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) return res.status(401);
      const refreshTokens = await authService.getAllRefreshTokens();
      if (!refreshTokens.includes(refreshToken)) return res.status(403);
      verifyRefreshToken(refreshToken, (err, user) => {
         console.log('🚀 ~ file: authController.js ~ line 27 ~ user', user);
         if (err) res.status(403);
         const accessToken = generateAccessToken({ userName: user?.userName });
         res.json({ accessToken });
      });
   },
});

export default authenController();
