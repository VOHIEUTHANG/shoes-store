import Models from '../database/sequelize';
const product_itemModel = Models.product_items;
class product_itemService{
    async save(productId,inventory,size){
        try {
            const product_item = await product_itemModel.create({
              PRODUCT_ID: productId,
              inventory:inventory,
              size: size,
              });
              return product_item;
        } catch (err) {
            console.log('🚀 ~ file: product_item.service.js ~ line 10 ~ product_itemService ~ error', err);
            return null;
        }   
    }
    async getAllById(id){
        try {
            let product_categories = product_itemModel.findAll({
                where:{
                    PRODUCT_ID: id
                },
                attributes: ['inventory','size'] 
            });
             return product_categories;
        } catch (error) {
            console.log('🚀 ~ file: product_item.service.js ~ line 10 ~ product_itemService ~ error', error);
            return null;
        }
    }
    async update(productId, size,inventory){
          try {
            this.save(productId,inventory,size);
            }
           catch (error) {
            console.log('🚀 ~ file: product_item.service.js ~ line 41 ~ product_itemService ~ error', error);
          }
    }
    async deleteByProductId(productId){
        try {
            await product_itemModel.destroy({
                where: {
                    PRODUCT_ID: productId,
                  },
                  force: true
            });
            }
           catch (error) {
            console.log('🚀 ~ file: product_item.service.js ~ line 51 ~ product_itemService ~ error', error);
          }
    }
}
module.exports = new product_itemService;