import authService from '../service/auth.service';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../helpers/tokenHandler';

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
            const insertRefreshTokenResult = await authService.insertRefreshTokens(refreshToken, userName);
            res.cookie('token', accessToken, options);
            res.send({ info: 'success', accessToken, refreshToken });
         } else res.json({ info: 'failed', message: 'User name or pass is incorrect !' });
      } else res.json({ info: 'failed', message: 'Missing userName of password !' });
   },
   async register(req, res, next) {
      const userInfor = req.body;
      res.json({ userInfor });
   },
   async logout(req, res, next) {
      const { refreshToken } = req.body;
      if (!refreshToken) res.json({ info: 'missing refreshToken !' });
      verifyRefreshToken(refreshToken, async (err, user) => {
         const userName = user?.userName;
         if (!userName) res.json({ info: 'missing userName !' });
         const deleteRefreshTokensResult = await authService.deleteRefreshTokensByUserName(userName);
         if (deleteRefreshTokensResult) res.json({ info: 'logout successfully!' });
         else res.json({ info: 'logout failed!' });
      });
   },
   async getNewAccessToken(req, res, next) {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) return res.render('pages/401');
      const refreshTokens = await authService.getAllRefreshTokens();
      if (!refreshTokens?.includes(refreshToken)) return res.render('pages/403');
      verifyRefreshToken(refreshToken, (err, user) => {
         console.log('🚀 ~ file: authController.js ~ line 27 ~ user', user);
         if (err) res.render('pages/403');
         const accessToken = generateAccessToken({ userName: user?.userName });
         res.json({ accessToken });
      });
   },
});

export default authenController();
