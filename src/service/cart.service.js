import Models from '../database/sequelize';
import { createResponse } from '../helpers/responseCreator';
import sequelize, { Op } from 'sequelize';
import { calculatePriceAfterApplyDiscount, calculateDiscountPrice } from '../helpers/discountHandler';
import formatToCurrency from '../helpers/formatCurrency';
const CartModel = Models.cart;
const ProductItemModel = Models.product_items;
const productModel = Models.product;
const productImageModel = Models.product_images;
const discountModel = Models.discount;

class Cart {
   async addCart(username, productItemID, quantity) {
      if (username && productItemID && quantity) {
         try {
            const checkExitsProduct = await CartModel.findOne({
               where: {
                  username,
                  PRODUCT_ITEMS_ID: productItemID,
               },
            });
            if (checkExitsProduct === null) {
               const insertCartResult = await CartModel.create({
                  username,
                  PRODUCT_ITEMS_ID: productItemID,
                  quantity,
               });
               return true;
            }
            return createResponse('warning', 'Sản phẩm này đã được thêm vào giỏ hàng !');
         } catch (error) {
            console.log('🚀 ~ file: cart.service.js ~ line 9 ~ Cart ~ error', error);
            return false;
         }
      } else {
         console.log('Missing some paramenters to insert cart db !');
         return false;
      }
   }
   async getAllCartByUsername(username) {
      const timeNow = new Date();
      if (username) {
         try {
            const cartListResult = await CartModel.findAll({
               where: {
                  username,
               },
               include: {
                  model: ProductItemModel,
                  as: 'PRODUCT_ITEM',
                  include: {
                     model: productModel,
                     as: 'PRODUCT',
                     attributes: ['name', 'price', 'slug'],
                     include: [
                        {
                           model: productImageModel,
                           as: 'product_images',
                           attributes: ['imageURL'],
                        },
                        {
                           model: discountModel,
                           required: false,
                           as: 'discounts',
                           where: {
                              isApply: true,
                              [Op.and]: [sequelize.where(sequelize.fn('date', sequelize.col('endDate')), '>', timeNow)],
                           },
                        },
                     ],
                  },
               },
            });

            const cartFormated = cartListResult.map((cart) => {
               const thisProduct = cart.dataValues.PRODUCT_ITEM.dataValues.PRODUCT.dataValues;
               return {
                  ...cart.dataValues,
                  PRODUCT_ITEM: {
                     ...cart.dataValues.PRODUCT_ITEM.dataValues,
                     PRODUCT: {
                        name: thisProduct.name,
                        price: thisProduct.price,
                        slug: thisProduct.slug,
                        imageURL: thisProduct.product_images[0].dataValues.imageURL,
                        discounts:
                           thisProduct.discounts.length > 0
                              ? {
                                   ...thisProduct?.discounts[0]?.dataValues,
                                   priceAfterApplyDiscount: formatToCurrency(
                                      calculatePriceAfterApplyDiscount(
                                         thisProduct.price,
                                         thisProduct.discounts[0].dataValues.percentReduction,
                                      ),
                                   ),
                                   discountPrice: formatToCurrency(
                                      calculateDiscountPrice(
                                         thisProduct.price,
                                         thisProduct.discounts[0].dataValues.percentReduction,
                                      ),
                                   ),
                                }
                              : null,
                     },
                  },
               };
            });
            return cartFormated;
         } catch (error) {
            console.log('🚀 ~ file: user.controller.js ~ line 183 ~ error', error);
            return false;
         }
      } else {
         return false;
      }
   }
   async deleteCartItem(username, productItemID) {
      if ((username, productItemID)) {
         try {
            const delteCartResult = await CartModel.destroy({
               where: {
                  username,
                  PRODUCT_ITEMS_ID: productItemID,
               },
            });
            console.log('delteCartResult', delteCartResult);
            return true;
         } catch (error) {
            console.log('🚀 ~ file: cart.service.js ~ line 89 ~ Cart ~ error', error);
            return false;
         }
      } else {
         return false;
      }
   }
}

export default new Cart();
