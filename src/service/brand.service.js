import pool from './connectDB';

class BrandService {
   async getAllBrands() {
      try {
         const [brands] = await pool.execute('SELECT * FROM brand');
         return brands;
      } catch (error) {
         console.log('🚀 ~ file: brand.service.js ~ line 8 ~ BrandService ~ error', error);
         return null;
      }
   }
}

export default new BrandService();
