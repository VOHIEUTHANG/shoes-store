import pool from '../database/pool';
import Models from '../database/sequelize';
import passwordHandler from '../helpers/passwordHandler.js';
const UserModel = Models.user;
const AccountModel = Models.account;
const wishListModel = Models.wish_list;

import PasswordHandler from '../helpers/passwordHandler';
import { createResponse } from '../helpers/responseCreator';

class userService {
   async login(username, password) {
      const [rows] = await pool.execute(
         'SELECT userName,password,avatar,permissionCode FROM account,role WHERE userName = ? AND ROLE_ID = role.id;',
         [username],
      );
      if (rows.length > 0) {
         const checkMatchPassword = PasswordHandler.checkMatch(password, rows[0].password);
         const user = rows[0];
         delete user.password;
         return checkMatchPassword ? user : null;
      }
      return null;
   }
   async register({ fullName, email, phoneNumber, userName, password, avatar }) {
      const hashPassword = PasswordHandler.getHashPassword(password);
      try {
         const [rows] = await pool.query('SELECT * FROM account WHERE userName = ?', [userName]);
         if (rows.length > 0) {
            return createResponse('warning', 'Tài khoản đã tồn tại');
         }
         const [insertAccountHeaderResult] = await pool.query(
            'INSERT INTO account (userName,password,avatar,ROLE_ID,isVerify,isLocked) VALUES (?,?,?,3,0,0)',
            [userName, hashPassword, avatar],
         );
         const [insertUserHeaderResult] = await pool.query(
            'INSERT INTO user (userName,fullName,email,phoneNumber) VALUES (?,?,?,?)',
            [userName, fullName, email, phoneNumber],
         );
         return insertAccountHeaderResult.affectedRows > 0 && insertUserHeaderResult.affectedRows > 0 ? true : false;
      } catch (error) {
         return false;
      }
   }
   async updateUserInfo(userInfo) {
      if (!userInfo?.username) {
         console.log('missing username...');
         return false;
      }
      try {
         const updateUserResult = await UserModel.update(
            {
               fullName: userInfo.fullName,
               gender: userInfo.gender,
               address: userInfo.address,
            },
            {
               where: {
                  username: userInfo.username,
               },
            },
         );
         if (userInfo.avatar) {
            const updateAccountResult = await AccountModel.update(
               {
                  avatar: userInfo.avatar,
               },
               {
                  where: {
                     username: userInfo.username,
                  },
               },
            );
         }
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }
   async getUserInfo(username) {
      const userInfo = UserModel.findAll({
         where: {
            username: username,
         },
      });
      const userAvatar = AccountModel.findAll({
         attributes: ['avatar'],
         where: {
            username: username,
         },
      });
      return Promise.all([userInfo, userAvatar])
         .then((res) => {
            let expectData = {};
            res.forEach((data) => {
               expectData = Object.assign(expectData, data[0].dataValues);
            });
            return expectData;
         })
         .catch(console.log);
   }
   async getAllRefreshTokens() {
      const [rows] = await pool.execute('select refreshToken from refresh_tokens');
      if (rows.length > 0) {
         const refreshTokens = rows.map((tokenObject) => tokenObject.refreshToken);
         return refreshTokens;
      }
      return null;
   }
   async insertRefreshTokens(refreshToken, userName) {
      try {
         const [{ affectedRows }, rows] = await pool.execute(
            'INSERT INTO refresh_tokens (refreshToken,userName) VALUES (?,?);',
            [refreshToken, userName],
         );
         return affectedRows > 0;
      } catch (error) {
         console.log('Insert data into refresh_tokens table occured error :', error);
         return false;
      }
   }
   async deleteRefreshTokensByUserName(userName) {
      try {
         const [{ affectedRows }, rows] = await pool.execute('DELETE FROM refresh_tokens WHERE userName = ?;', [
            userName,
         ]);
         return affectedRows > 0;
      } catch (error) {
         console.log('Delete refresh token occured error :', error);
         return false;
      }
   }
   async changePassword(username, currentPassword, newPassword) {
      const targetAccount = await AccountModel.findAll({
         attributes: ['username', 'password'],
         where: {
            username,
         },
      });
      if (targetAccount.length === 0) return 'Người dùng này hiện không tồn tại !';
      const hashPassword = targetAccount[0].dataValues.password;
      const isMatchPassword = passwordHandler.checkMatch(currentPassword, hashPassword);
      if (!isMatchPassword) return 'Mật khẩu hiện tại không đúng !';
      if (newPassword?.length < 8) return 'Mật khẩu mới không hợp lệ !';
      try {
         const newHashPassword = passwordHandler.getHashPassword(newPassword);
         await AccountModel.update(
            {
               password: newHashPassword,
            },
            {
               where: {
                  username,
               },
            },
         );
         return true;
      } catch (error) {
         console.log('🚀 ~ file: user.service.js ~ line 147 ~ userService ~ error', error);
         return 'Update mật khẩu mới xảy ra lỗi !';
      }
   }
   async addToWishList(username, PRODUCT_ID) {
      if (username && PRODUCT_ID) {
         try {
            const insertWishListResult = await wishListModel.create({
               username,
               PRODUCT_ID,
            });
            return true;
         } catch (error) {
            return false;
         }
      }
      return false;
   }
}
export default new userService();
