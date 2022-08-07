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
}
module.exports = new product_categoryService;