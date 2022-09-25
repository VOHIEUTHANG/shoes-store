import Models from '../database/sequelize';
const product_categoryModel = Models.product_category;
class product_categoryService{
    async save(productId,categoryId,){
        try {
            const product_category = await product_categoryModel.create({
              PRODUCT_ID: productId,
              CATEGORY_ID:categoryId,
              });
              return product_category;
        } catch (err) {
            console.log('🚀 ~ file: product_category.service.js ~ line 10 ~ product_categoryService ~ error', err);
            return null;
        }   
    }
    async update(productId,categoryId){
        try {
            const product_category = await product_categoryModel.upsert({
              PRODUCT_ID: productId,
              CATEGORY_ID:categoryId,
              });
              return product_category;
        } catch (err) {
            console.log('🚀 ~ file: product_category.service.js ~ line 23 ~ product_categoryService ~ error', err);
            return null;
        }   
    }
    async deleteByProductId(id){
        try {
           let cate = await product_categoryModel.destroy({
              where:{
                 PRODUCT_ID:id
              },
              force: true
           });
           return cate;
        } catch (error) {
           console.log('🚀 ~ file: category.service.js ~ line 18 ~ CategoryService ~ error', error);
           return null;
        }
     }
    
}
module.exports = new product_categoryService;