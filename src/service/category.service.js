import Models from '../database/sequelize';
const Category = Models.category;

class CategoryService {
   async getAllCategory() {
      try {
         const categorys = await Category.findAll();
         return categorys;
      } catch (error) {
         console.log('🚀 ~ file: category.service.js ~ line 10 ~ CategoryService ~ error', error);
         return null;
      }
   }
}

export default new CategoryService();
