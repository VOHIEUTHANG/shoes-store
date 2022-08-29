import pool from '../database/pool';
import Models from '../database/sequelize';
import passwordHandler from '../helpers/passwordHandler.js';
import formatToCurrency from '../helpers/formatCurrency';
const UserModel = Models.user;
const ProductModel = Models.product;
const AccountModel = Models.account;
const wishListModel = Models.wish_list;
const BrandModel = Models.brand;
const ProductImagesModel = Models.product_images;
const cartModel = Models.cart;
const deliverAddressModel = Models.delivery_address;

import PasswordHandler from '../helpers/passwordHandler';
import { createResponse } from '../helpers/responseCreator';
import orderService from './order.service';

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
      const wishListOfTargetUser = await wishListModel.findOne({
         where: {
            username,
            PRODUCT_ID,
         },
      });
      console.log('wishListOfTargetUser', wishListOfTargetUser);
      if (wishListOfTargetUser !== null) return createResponse('warning', 'Sản phẩm này đã được thêm vào wishlist !');
      try {
         await wishListModel.create({
            username,
            PRODUCT_ID,
         });
         return true;
      } catch (error) {
         return false;
      }
   }
   async deleteWishListByUsernameAndPrdocutID(username, PRODUCT_ID) {
      try {
         const count = await wishListModel.destroy({
            where: {
               username,
               PRODUCT_ID,
            },
         });
         return count > 0 ? true : false;
      } catch (error) {
         console.log('🚀 ~ file: user.service.js ~ line 197 ~ userService ~ error', error);
         return false;
      }
   }

   async getAllProductsWishList(username) {
      if (username) {
         try {
            const wishListResult = await wishListModel.findAll({
               include: {
                  model: ProductModel,
                  as: 'PRODUCT',
                  attributes: {
                     exclude: ['sellStartDate', 'suitableFor', 'specifications', 'descriptions', 'BRAND_ID'],
                  },
                  include: [
                     {
                        model: BrandModel,
                        as: 'BRAND',
                        required: true,
                     },
                     {
                        model: ProductImagesModel,
                        as: 'product_images',
                        required: true,
                     },
                  ],
               },
               where: {
                  username,
               },
            });
            const formatedData = wishListResult.map((wishlist) => {
               return {
                  ...wishlist.dataValues,
                  PRODUCT: {
                     ...wishlist.dataValues.PRODUCT.dataValues,
                     BRAND: wishlist.dataValues.PRODUCT.dataValues.BRAND.dataValues.brandName,
                     price: formatToCurrency(Number(wishlist.dataValues.PRODUCT.dataValues.price) * 1000),
                     product_images: wishlist.dataValues.PRODUCT.dataValues.product_images[0].dataValues.imageURL,
                  },
               };
            });
            return formatedData;
         } catch (error) {
            console.log('🚀 ~ file: user.service.js ~ line 189 ~ userService ~ error', error);
            return false;
         }
      } else {
         console.log('Missing username !');
         return false;
      }
   }

   async editCartByUsernameAndProductItemID({ productItemID, username, quantity }) {
      if (productItemID && username && quantity) {
         try {
            const updateRows = await cartModel.update(
               {
                  quantity: quantity,
               },
               {
                  where: {
                     username: username,
                     PRODUCT_ITEMS_ID: productItemID,
                  },
               },
            );
            return updateRows[0] > 0;
         } catch (error) {
            console.log('🚀 ~ file: user.service.js ~ line 256 ~ userService ~ error', error);
            return false;
         }
      } else {
         return false;
      }
   }
   async addDeliveryAddressByUsername({ addressData, username }) {
      if (addressData && username) {
         try {
            const insertRow = await deliverAddressModel.create({
               province: addressData.province || null,
               district: addressData.district || null,
               wards: addressData.ward || null,
               address_detail: addressData.detailAddress || null,
               username,
            });
            return insertRow.dataValues;
         } catch (error) {
            console.log('🚀 ~ file: user.service.js ~ line 280 ~ userService ~ error', error);
            return false;
         }
      }
      return false;
   }
   async getAllDeliveryAddressByUsername(username) {
      if (username) {
         try {
            const addressResult = await deliverAddressModel.findAll({
               where: {
                  username,
               },
               order: [['ID', 'DESC']],
            });
            const addressResultFormated = addressResult.map((address) => {
               return address.dataValues;
            });
            return addressResultFormated;
         } catch (error) {
            console.log('🚀 ~ file: user.service.js ~ line 299 ~ userService ~ error', error);
            return false;
         }
      } else {
         return null;
      }
   }
   async deleteAddressByID(addressID, username) {
      if (username && addressID) {
         try {
            const deleteRow = await deliverAddressModel.destroy({
               where: {
                  username,
                  ID: addressID,
               },
            });
            return deleteRow > 0;
         } catch (error) {
            console.log('🚀 ~ file: user.service.js ~ line 319 ~ userService ~ error', error);
            return false;
         }
      } else {
         return false;
      }
   }

   async getAddressByID(addressID) {
      if (addressID) {
         try {
            const targetAddress = await deliverAddressModel.findOne({
               where: {
                  ID: addressID,
               },
            });
            if (targetAddress) {
               return targetAddress.dataValues;
            } else {
               console.log('Not found !');
               return null;
            }
         } catch (error) {
            console.log('🚀 ~ file: user.service.js ~ line 338 ~ userService ~ error', error);
            return null;
         }
      } else {
         return null;
      }
   }
   async updateAddressByID(addressData) {
      console.log(addressData);
      if (addressData) {
         try {
            const updateRows = await deliverAddressModel.update(
               {
                  province: addressData.province,
                  district: addressData.district,
                  wards: addressData.ward,
                  address_detail: addressData.detailAddress,
               },
               {
                  where: {
                     ID: Number(addressData.ID),
                  },
               },
            );
            return true;
         } catch (error) {
            console.log('error ===> ', error);
            return null;
         }
      } else {
         return null;
      }
   }
}
export default new userService();
