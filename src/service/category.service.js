import Models from '../database/sequelize';
const CategoryModel = Models.category;
const ProductCategoryModel = Models.product_category;
const ProductModel = Models.product;

class CategoryService {
   async getAllCategory() {
      try {
         const categorys = await CategoryModel.findAll();
         return categorys;
      } catch (error) {
         console.log('🚀 ~ file: category.service.js ~ line 10 ~ CategoryService ~ error', error);
         return null;
      }
   }
   async getAllCategoryAndCountProductsBelongTo() {
      try {
         const categorysResult = await CategoryModel.findAll({
            include: {
               model: ProductCategoryModel,
               as: 'product_categories',
               include: {
                  model: ProductModel,
                  as: 'PRODUCT',
                  where: {
                     isSelling: true,
                  },
               },
            },
         });
         const categoriesFormated = categorysResult.map((category) => {
            const categoryValues = category.dataValues;
            return {
               ID: categoryValues.ID,
               name: categoryValues.name,
               productCount: categoryValues.product_categories.length,
            };
         });
         return categoriesFormated;
      } catch (error) {
         console.log('🚀 ~ file: category.service.js ~ line 18 ~ CategoryService ~ error', error);
         return null;
      }
   }
  
}

export default new CategoryService();
