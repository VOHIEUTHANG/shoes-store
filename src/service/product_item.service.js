import Models from '../database/sequelize';
const product_itemModel = Models.product_items;
class product_itemService {
   async save(productId, size, inventory) {
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
   async getAllById(id) {
      try {
         let product_categories = product_itemModel.findAll({
            where: {
               PRODUCT_ID: id,
            },
         });
         return product_categories;
      } catch (error) {
         console.log('🚀 ~ file: product_item.service.js ~ line 10 ~ product_itemService ~ error', error);
         return null;
      }
   }
   async update(Id, size, inventory,productId) {
      try {
        let product_item= product_itemModel.upsert({
         ID:Id,
         size:size,
         inventory:inventory,
         PRODUCT_ID:productId,
        })
      } catch (error) {
         console.log('🚀 ~ file: product_item.service.js ~ line 41 ~ product_itemService ~ error', error);
      }
   }
   async deleteByProductId(productId) {
      try {
         await product_itemModel.destroy({
            where: {
               PRODUCT_ID: productId,
            },
            force: true,
         });
      } catch (error) {
         console.log('🚀 ~ file: product_item.service.js ~ line 41 ~ product_itemService ~ error', error);
      }
   }
   async getOne(productId, size) {
      try {
         let product_item = await product_itemModel.findOne({
            where: {
               PRODUCT_ID: productId,
               size: size,
            },
         });
         console.log(product_item);
         return product_item;
      } catch (error) {
         return null;
         console.log('🚀 ~ file: product_item.service.js ~ line 51 ~ product_itemService ~ error', error);
      }
   }
}
module.exports = new product_itemService();
