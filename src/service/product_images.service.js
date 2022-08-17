import Models from '../database/sequelize';
const product_imagesModel = Models.product_images;
class product_imagesService{
    async save(productId,path){
        try {
            const product_images = await product_imagesModel.create({
              PRODUCT_ID: productId,
              imageURL: path
              });
              return product_images;
        } catch (err) {
            console.log('🚀 ~ file: product_images.service.js ~ line 11 ~ product_itemService ~ error', err);
            return null;
        }   
    }
}
module.exports = new product_imagesService;