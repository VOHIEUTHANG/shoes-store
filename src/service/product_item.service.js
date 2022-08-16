import Models from '../database/sequelize';
const product_itemModel = Models.product_items;
class product_itemService {
   async save(productId, inventory, size) {
      try {
         const product_item = await product_itemModel.create({
            PRODUCT_ID: productId,
            inventory: inventory,
            size: size,
         });
         return product_item;
      } catch (err) {
         console.log('🚀 ~ file: product_item.service.js ~ line 10 ~ product_itemService ~ error', err);
         return null;
      }
   }
}
module.exports = new product_itemService();
