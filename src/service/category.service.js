import pool from './connectDB';
class CategoryService {
   async getAllCategory() {
      try {
         const [categorys] = await pool.execute('SELECT * FROM category');
         return categorys;
      } catch (error) {
         console.log(error);
         return null;
      }
   }
}

export default new CategoryService();
