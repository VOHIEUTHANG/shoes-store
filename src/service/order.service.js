import Models from '../database/sequelize';
const OrderModel = Models.order;
const OrderDetailModel = Models.order_detail;
const ProductItemModel = Models.product_items;
const ProductModel = Models.product;
const ProductImagesModel = Models.product_images;

class OrderService {
   async createOrder(orderData, transaction) {
      if (orderData) {
         try {
            const order = await OrderModel.create(
               {
                  username: orderData.username,
                  totalMoney: orderData.totalMoney,
                  paymentStatus: orderData.paymentStatus,
                  orderStatus: orderData.orderStatus,
                  orderTime: orderData.orderTime,
                  DELIVERY_ADDRESS_ID: orderData.DELIVERY_ADDRESS_ID,
               },
               { transaction },
            );
            if (order) {
               return order.dataValues.ID;
            } else {
               return false;
            }
         } catch (error) {
            console.log('🚀 ~ file: order.service.js ~ line 10 ~ OrderService ~ error', error);
            return false;
         }
      } else {
         return false;
      }
   }
   async createOrderDetail(orderDetailDataList, transaction) {
      console.log('orderDetailDataList ===> ', orderDetailDataList);
      if (orderDetailDataList) {
         try {
            const promiseQueue = orderDetailDataList.map((orderDetail) => {
               return OrderDetailModel.create({ ...orderDetail }, { transaction });
            });

            console.log('promiseQueue ===> ', promiseQueue);

            if (promiseQueue) {
               let insertOrderDetailReulst = await Promise.all(promiseQueue);
               console.log('insertOrderDetailReulst ===> ', insertOrderDetailReulst);
               if (insertOrderDetailReulst) {
                  insertOrderDetailReulst = insertOrderDetailReulst.map((orderDetail) => {
                     return orderDetail.dataValues;
                  });
               }
               return insertOrderDetailReulst;
            } else {
               return false;
            }
         } catch (error) {
            console.log('🚀 ~ file: order.service.js ~ line 33 ~ OrderService ~ error', error);
            return false;
         }
      } else {
         return false;
      }
   }
   async checkIsAddressUsed(addressID, username) {
      const order = await OrderModel.findOne({
         where: {
            username,
            DELIVERY_ADDRESS_ID: addressID,
         },
      });
      return !!order;
   }
   async getAllOrderByUsername(username) {
      if (username) {
         try {
            const orderList = await OrderModel.findAll({
               include: {
                  model: ProductItemModel,
                  as: 'PRODUCT_ITEMS_ID_product_items_order_details',
                  include: {
                     model: ProductModel,
                     as: 'PRODUCT',
                     include: {
                        model: ProductImagesModel,
                        as: 'product_images',
                     },
                     attributes: ['name', 'isSelling', 'price', 'slug'],
                  },
               },
               where: {
                  username,
               },
               order: [['ID', 'DESC']],
            });
            const formatedData = orderList.map((order) => {
               const orderVal = order.dataValues;
               let result = {
                  ...orderVal,
                  productItems: orderVal.PRODUCT_ITEMS_ID_product_items_order_details?.map((productItem) => {
                     return {
                        ...productItem.dataValues,
                        order_detail: productItem.dataValues?.order_detail.dataValues,
                        PRODUCT: {
                           ...productItem.dataValues?.PRODUCT.dataValues,
                           product_images:
                              productItem.dataValues?.PRODUCT.dataValues?.product_images[0].dataValues.imageURL,
                        },
                     };
                  }),
               };
               delete result.PRODUCT_ITEMS_ID_product_items_order_details;
               return result;
            });
            console.log('formatedData ===> ', formatedData);
            return formatedData;
         } catch (error) {
            console.log('🚀 ~ file: order.service.js ~ line 69 ~ OrderService ~ error', error);
            return null;
         }
      } else {
         return null;
      }
   }
}
export default new OrderService();
