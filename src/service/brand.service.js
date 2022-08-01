import pool from '../database/pool';
import Models from '../database/sequelize';
const Brand = Models.brand;

class BrandService {
   async getAllBrands() {
      try {
         const brands = await Brand.findAll();
         return brands;
      } catch (error) {
         console.log('🚀 ~ file: brand.service.js ~ line 11 ~ BrandService ~ error', error);
         return null;
      }
   }
}

export default new BrandService();
