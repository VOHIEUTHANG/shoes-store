import Models from '../database/sequelize';
const product_imagesModel = Models.product_images;
import deleteFile from '../helpers/deleteFile';
class product_imagesService{
    async save(productId,path){
        try {
            let product_images = await product_imagesModel.create({
              PRODUCT_ID: productId,
              imageURL: path
              });
              return product_images;
        } catch (err) {
            console.log('🚀 ~ file: product_images.service.js ~ line 11 ~ product_itemService ~ error', err);
            return null;
        }   
    }
    async get(productId){
        try{
           let product_images = await product_imagesModel.findAll(
            {   attributes:[['ID','id'],['imageURL','src']],
                where:{PRODUCT_ID:productId}
            }
            );
           return product_images;
        }catch(err){
            console.log('🚀 ~ file: product_images.service.js ~ line 18 ~ product_itemService ~ error',err);
            return null;
        }
    }
    async delete(url){
      deleteFile(url);
      try {
        let product_image = await product_imagesModel.destroy({
            where: { imageURL:url},
            force: true
        });
        return product_image;
        } catch (error) {
            console.log('🚀 ~ file: product_images.service.js ~ line 33 ~ product_itemService ~ error',error);
            return null;     
        }
    }
}
module.exports = new product_imagesService;