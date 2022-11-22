import userService from '../service/user.service';
import cartService from '../service/cart.service';
import orderService from '../service/order.service';
import { sequelize } from '../database/sequelize';

import formatPath from '../helpers/pathFormated.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../helpers/tokenHandler';
import { createResponse } from '../helpers/responseCreator';
import convertFromStringToNumber from '../helpers/convertCurrencyFromStringToNmber';
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
         if (!refreshToken) return res.status(401).json(createResponse('error', 'Missing refreshToken !'));
         verifyRefreshToken(refreshToken, async (err, user) => {
            if (err) return res.status(403).json(createResponse('error', 'Invalid refreshToken !'));
            const userName = user?.userName;
            if (!userName) return res.json(createResponse('error', 'Missing userName data payload in refreshToken'));
            const deleteRefreshTokensResult = await userService.deleteRefreshTokensByUserName(userName);
            if (deleteRefreshTokensResult) res.json(createResponse('success', 'Login successfully !'));
            else res.status(400).json(createResponse('error', 'Login failed !'));
         });
      });
   },
   async logoutBackup(req, res) {
      req.logout((err) => {
         if (!err) {
            res.status(200).json('success');
         } else {
            res.status(400).json('error');
         }
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
            const insertRefreshTokenResult = await userService.insertRefreshTokens(newRefreshToken, user?.userName);
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
         const path = formatPath(avatar);
         userInfo.avatar = path;
      }
      userInfo.username = username;
      const updateUserResult = await userService.updateUserInfo(userInfo);
      if (updateUserResult) {
         res.status(200).json(createResponse('success', 'Cập nhật thông tin người dùng thành công !'));
      } else {
         res.status(400).json(createResponse('error', 'Cập nhật thông tin người đùng thất bại!'));
      }
   },
   async changePassword(req, res) {
      const { currentPassword, newPassword } = req.body;
      const username = req.user.userName;
      try {
         const updateResult = await userService.changePassword(username, currentPassword, newPassword);
         if (typeof updateResult === 'string') {
            res.json(createResponse('warning', updateResult));
         } else {
            res.json(createResponse('success', 'Cập nhật mật khẩu mới thành công !'));
         }
      } catch (error) {
         res.status(400).json(createResponse('error', 'Occured erorr !'));
      }
   },
   async addToWishList(req, res) {
      const productID = req.params.productID;
      const username = req.user.userName;
      if (productID && productID) {
         const insertWishListResult = await userService.addToWishList(username, productID);
         if (insertWishListResult === true) {
            return res.json(createResponse('success', 'Thêm sản phẩm vào wishlist thành công !'));
         } else if (typeof insertWishListResult === 'object') {
            return res.json(insertWishListResult);
         } else {
            return res.json(createResponse('error', 'Có lỗi xảy ra khi thêm sản phẩm vào wishlist !'));
         }
      } else {
         return res.json(createResponse('error', 'Missing username or productID'));
      }
   },
   async deleteFromWishList(req, res) {
      const productID = req.params.productID;
      const username = req.user.userName;
      if (productID && username) {
         const deleteResult = await userService.deleteWishListByUsernameAndPrdocutID(username, productID);
         console.log('🚀 ~ file: user.controller.js ~ line 148 ~ deleteResult', deleteResult);
         if (deleteResult) {
            return res.json(createResponse('success', 'Xóa sản phẩm khỏi wishlist thành công !'));
         } else {
            return res.json(createResponse('error', 'Xóa sản phẩm khỏi wishlist thất bại !'));
         }
      } else {
         return res.json(createResponse('error', 'Missing username or productID'));
      }
   },
   async addCart(req, res) {
      const username = req.user.userName;
      const { productItemID, quantity } = req.body;
      if (username && productItemID && quantity) {
         const insertCartResult = await cartService.addCart(username, productItemID, quantity);
         if (!insertCartResult) {
            return res.json(createResponse('error', 'Thêm sản phẩm vào giỏ hàng xảy ra lỗi !'));
         } else if (insertCartResult === true) {
            return res.json(createResponse('success', 'Thêm sản phẩm vào giỏ hàng thành công !'));
         } else if (typeof insertCartResult === 'object') {
            return res.json(insertCartResult);
         }
      } else {
         return res.json(createResponse('warning', 'Missing some params !'));
      }
   },
   async deleteCartItem(req, res) {
      const productItemID = req.params.productItemID;
      const username = req.user.userName;
      const delteCartResult = await cartService.deleteCartItem(username, productItemID);
      if (delteCartResult === true) {
         res.json(createResponse('success', 'Xóa sản phẩm thành công !'));
      } else {
         res.json(createResponse('erorr', 'Xóa sản phẩm ra khỏi giỏ hàng thất bại !'));
      }
   },
   async editCart(req, res) {
      const username = req.user.userName;
      const { productItemID, quantity } = req.body;
      console.log({ productItemID, quantity });
      const updateResult = await userService.editCartByUsernameAndProductItemID({ username, productItemID, quantity });
      console.log('🚀 ~ file: user.controller.js ~ line 191 ~ updateResult', updateResult);
      if (updateResult) {
         res.json(createResponse('success', 'Update cart successfully !'));
      } else {
         res.json(createResponse('error', 'Udpate cart failured !'));
      }
   },
   async addAddress(req, res) {
      const addressData = req.body;
      const username = req.user?.userName;
      console.log({
         addressData,
         username,
      });
      const newAddress = await userService.addDeliveryAddressByUsername({ addressData, username });
      if (newAddress) {
         return res.json(JSON.stringify(createResponse('success', 'Thêm địa chỉ giao hàng thành công !', newAddress)));
      } else {
         return res.json(createResponse('error', 'Thêm địa chỉ thất bại !'));
      }
   },
   async deleteDeliveryAddress(req, res) {
      const addressID = req.params.addressID;
      const username = req.user?.userName;
      const isAddressUsed = await orderService.checkIsAddressUsed(addressID, username);
      console.log('isAddressUsed => ', isAddressUsed);
      if (isAddressUsed) {
         return res.json(createResponse('warning', 'Địa chỉ này đã được sử dụng, không thể xóa !'));
      }
      const deleteResult = await userService.deleteAddressByID(addressID, username);
      return deleteResult
         ? res.json(createResponse('success', 'Xóa địa chỉ thành công !'))
         : res.json(createResponse('error', 'Xóa địa chỉ thất bại !'));
   },
   async getAddress(req, res) {
      const addressID = req.params.addressID;
      const address = await userService.getAddressByID(addressID);
      if (address) {
         res.json(JSON.stringify(address));
      } else {
         res.json(createResponse('error', 'Get new address failured !'));
      }
   },
   async updateAddress(req, res) {
      const addressData = req.body;
      const updateResult = await userService.updateAddressByID(addressData);
      console.log('🚀 ~ file: user.controller.js ~ line 243 ~ updateResult', updateResult);
      if (updateResult) {
         res.json(JSON.stringify(createResponse('success', 'Cập nhật địa chỉ nhận hàng thành công !', addressData)));
      } else {
         res.json(createResponse('error', 'Update delivery address failed !'));
      }
   },
   async createOrder(req, res) {
      const createOrderTransaction = await sequelize.transaction();

      const addressID = req.body?.addressID;
      const username = req.user?.userName;
      const priceFormated = (stringPrice) => Number(Math.round(convertFromStringToNumber(stringPrice) / 1000));
      if (username) {
         const { cartList } = req.payload;
         console.log({ addressID, username, cartList });
         const orderData = {
            username,
            totalMoney: priceFormated(cartList.totalPrice),
            paymentStatus: false,
            diliveryStatus: null,
            orderStatus: 'processing',
            orderTime: new Date(),
            paymentTime: null,
            DELIVERY_ADDRESS_ID: Number(addressID),
         };
         console.log('cartList ===> ', cartList);
         cartList.forEach((cart) => {
            console.log(cart.PRODUCT_ITEM.PRODUCT);
         });

         try {
            const orderID = await orderService.createOrder(orderData, createOrderTransaction);
            if (orderID) {
               const orderDetailFormatedData = cartList.map((cartItem) => {
                  const productItem = cartItem.PRODUCT_ITEM;
                  const product = productItem.PRODUCT;
                  const discount = product.discounts;

                  return {
                     PRODUCT_ITEMS_ID: productItem.ID,
                     ORDER_ID: orderID,
                     quantity: cartItem.quantity,
                     price: priceFormated(product.price),
                     discount_percent: discount ? discount.percentReduction : 0,
                     intoMoney: discount
                        ? priceFormated(discount.priceAfterApplyDiscount) * cartItem.quantity
                        : priceFormated(product.price) * cartItem.quantity,
                  };
               });
               console.log('orderDetailFormatedData ===> ', orderDetailFormatedData);
               const orderDetailListResult = await orderService.createOrderDetail(
                  orderDetailFormatedData,
                  createOrderTransaction,
               );
               console.log('Order detail list ===>', orderDetailListResult);
               if (orderDetailListResult) {
                  await createOrderTransaction.commit();
                  return res.json(
                     JSON.stringify(createResponse('success', 'Tạo đơn hàng thành công !', orderDetailListResult)),
                  );
               } else {
                  await createOrderTransaction.rollback();
                  return res.json(createResponse('error', 'Tạo đơn hàng thất bại !'));
               }
            } else {
               await createOrderTransaction.rollback();
               return res.json(createResponse('error', 'Tạo đơn hàng thất bại !'));
            }
         } catch (error) {
            console.log('🚀 ~ file: user.controller.js ~ line 315 ~ error', error);
            await createOrderTransaction.rollback();
         }
      } else {
         res.redirect('/login');
      }
   },
});

export default userController();
