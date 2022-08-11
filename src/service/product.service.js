import Models from '../database/sequelize';
const productModel = Models.product;
import createSlug from '../helpers/createSlug';
const categoryModel = Models.category;
const brandModel= Models.brand;
const product_categoryModel = Models.product_category;
class productService {
   
    async getAll(){
        try {
            let products = productModel.findAll();
             return products
        } catch (err) {
            console.log('🚀 ~ file: product.service.js ~ method getAll ~ productService ~ error', error);
            return null;
        }
    }
    async getAllJoin(){
     let products = productModel.findAll(
     { include:[{model: brandModel, as :'BRAND' },
      {model: product_categoryModel,as:'product_categories',include:[{model: categoryModel, as:'CATEGORY'}]
       }],
       limit: 100
     });
     
      return products;
    }
    async getOneJoin(id){
        let product = productModel.findOne(
        { include:[{model: brandModel, as :'BRAND' },
         {model: product_categoryModel,as:'product_categories',include:[{model: categoryModel, as:'CATEGORY'}]
          }],
          where: {ID:id}
        });
         return product;
       }
    async save(data){
      try {
       let product = await productModel.create({
          name:data.name,
          isSelling:data.isSelling,
          sellStartDate: data.date,
          price: data.price,
          suitableFor: data.sex,
          specifications: data.detail,
          description: data.des,
          BRAND_ID: data.brand,
          slug: createSlug(data.name),
          })
          return product;
    } catch (err) {
        console.log('🚀 ~ file: product.service.js ~ method save ~ productService ~ error', err);
        return null;
    }   
    }
    async update(data){
      try {
        let product = await productModel.upsert({
           ID: data.id,
           name:data.name,
           isSelling:data.isSelling,
           sellStartDate: data.date,
           price: data.price,
           suitableFor: data.sex,
           specifications: data.detail,
           description: data.des,
           BRAND_ID: data.brand,
           slug: createSlug(data.name),
           })
           return product;
     } catch (err) {
         console.log('🚀 ~ file: product.service.js ~ method update ~ productService ~ error', err);
         return null;
     }   
    }
}
module.exports = new productService;