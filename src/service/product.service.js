import Models from '../database/sequelize';
const productModel = Models.product;
import createSlug from '../helpers/createSlug';
const categoryModel = Models.category;
const brandModel = Models.brand;
const product_categoryModel = Models.product_category;
const product_imagesModel = Models.product_images;
class productService {
   async getAll() {
      try {
         let products = productModel.findAll();
         return products;
      } catch (err) {
         console.log('🚀 ~ file: product.service.js ~ method getAll ~ productService ~ error', error);
         return null;
      }
   }
   async getAllJoin() {
      let products = productModel.findAll({
         include: [
            { model: brandModel, as: 'BRAND' },
            {
               model: product_categoryModel,
               as: 'product_categories',
               include: [{ model: categoryModel, as: 'CATEGORY' }],
            },
         ],
      });
      let brands = brandModel.findAll();
      let product_category = product_categoryModel.findAll();
      return products;
   }
   async save(data) {
      try {
         let product = await productModel.create({
            name: data.name,
            isSelling: data.isSelling,
            sellStartDate: data.date,
            price: data.price,
            suitableFor: data.sex,
            specifications: data.detail,
            description: data.des,
            BRAND_ID: data.brand,
            slug: createSlug(data.name),
         });
         return product;
      } catch (err) {
         console.log('🚀 ~ file: product.service.js ~ method save ~ productService ~ error', err);
         return null;
      }
   }
   async getActiveProduct({ offset = 0 }) {
      const filterPropertis = { isSelling: true };

      try {
         const { count, rows } = await productModel.findAndCountAll({
            attributes: {
               exclude: ['BRAND_ID', 'sellStartDate', 'specifications', 'descriptions'],
            },
            include: [
               {
                  model: brandModel,
                  as: 'BRAND',
               },
               {
                  model: product_imagesModel,
                  as: 'product_images',
               },
            ],
            where: filterPropertis,
            order: [],
            limit: 5,
            offset,
         });
         const products = rows.map((product) => ({
            ...product.dataValues,
            BRAND: product.dataValues.BRAND.brandName,
            product_images: product.dataValues.product_images[0]?.imageURL,
         }));
         return { total: count, products };
      } catch (error) {
         console.log('🚀 ~ file: product.service.js ~ line 63 ~ productService ~ error', error);
         return null;
      }
   }
}

module.exports = new productService();
