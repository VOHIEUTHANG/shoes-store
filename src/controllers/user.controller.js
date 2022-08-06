import userService from '../service/user.service';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../helpers/tokenHandler';
import { createResponse } from '../helpers/responseCreator';
import passport from 'passport';

const userController = () => ({
   async login(req, res, next) {
      passport.authenticate('local', async (err, user, info) => {
         try {
            if (!err && user === 'null') {
               return res.status(200).json({
                  title: 'error',
                  message: 'Tên đăng nhập hoặc mật khẩu không đúng !',
               });
            }
            if (err || user === false) {
               const error = new Error('An error occurred.');
               return next(error);
            }
            req.login(user, { session: true }, async (error) => {
               if (error) return next(error);
               if (!!user) {
                  const accessToken = generateAccessToken(user);
                  const refreshToken = generateRefreshToken(user);
                  const insertRefreshTokenResult = await userService.insertRefreshTokens(refreshToken, user.userName);
                  if (insertRefreshTokenResult) {
                     res.status(200).json({
                        title: 'success',
                        message: 'Đăng nhập thành công !',
                        payload: { accessToken, refreshToken },
                     });
                  } else {
                     res.status(200).json({
                        title: 'error',
                        message: 'Insert refresh token failed',
                     });
                  }
               }
            });
         } catch (error) {
            return next(error);
         }
      })(req, res, next);
   },
   async register(req, res, next) {
      const userInfo = req.body;
      userInfo.avatar = 'https://www.pngitem.com/pimgs/m/421-4212341_default-avatar-svg-hd-png-download.png';
      const result = await userService.register(userInfo);
      console.log('🚀 ~ file: authController.js ~ line 29 ~ result', result);
      if (result === true) res.json(createResponse('success', 'Đăng ký tài khoản thành công !'));
      else if (typeof result === 'object') {
         res.json(result);
      } else res.json(createResponse('error', 'Đăng ký tài thất bại !'));
   },
   async logout(req, res, next) {
      const { refreshToken } = req.body;
      req.logout(function (err) {
         if (err) {
            return res.json(createResponse('error', 'Logout thất bại !'));
         }
         if (!refreshToken) return res.json(createResponse('error', 'Missing refreshToken !'));
         verifyRefreshToken(refreshToken, async (err, user) => {
            if (err) return res.status(403).json(createResponse('error', 'Invalid refreshToken !'));
            const userName = user?.userName;
            if (!userName) return res.json(createResponse('error', 'Missing userName data payload in refreshToken'));
            const deleteRefreshTokensResult = await userService.deleteRefreshTokensByUserName(userName);
            if (deleteRefreshTokensResult) res.json(createResponse('success', 'Login successfully !'));
            else res.json(createResponse('error', 'Login failed !'));
         });
      });
   },
   async getNewAccessToken(req, res, next) {
      const { refreshToken } = req.body;
      if (!refreshToken) res.status(401).json(createResponse('error', 'Missing refresh token !'));
      const refreshTokens = await userService.getAllRefreshTokens();
      if (!refreshTokens?.includes(refreshToken)) {
         res.status(403).json(createResponse('error', 'forbiden'));
      } else {
         verifyRefreshToken(refreshToken, async (err, user) => {
            if (err) res.status(403).json(createResponse('error', 'forbiden'));
            const newAccessToken = generateAccessToken({ userName: user?.userName });
            const newRefreshToken = generateRefreshToken({ userName: user?.userName });
            const insertRefreshTokenResult = await userService.insertRefreshTokens(newRefreshToken, user.userName);
            insertRefreshTokenResult &&
               res.json(
                  createResponse('success', 'Refresh token successfully !', {
                     accessToken: newAccessToken,
                     refreshToken: newRefreshToken,
                  }),
               );
            insertRefreshTokenResult || res.json(createResponse('error', 'Insert refresh token failed !'));
         });
      }
   },
   async updateInfo(req, res) {
      const avatar = req.file;
      let { userInfo } = req.body;
      userInfo = JSON.parse(userInfo);
      const username = req.user.userName;
      if (!!avatar) {
         const avatarPathFormated = '/' + avatar.path.replaceAll('\\', '/');
         userInfo.avatar = avatarPathFormated.slice(avatarPathFormated.indexOf('assets') - 1);
      }
      userInfo.username = username;
      const updateUserResult = await userService.updateUserInfo(userInfo);
      if (updateUserResult) {
         res.status(200).json(createResponse('success', 'Cập nhật thông tin người dùng thành công !'));
      } else {
         res.status(400).json(createResponse('error', 'Cập nhật thông tin người đùng thất bại!'));
      }
   },
});

export default userController();
