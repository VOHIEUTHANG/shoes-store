import Models from '../database/sequelize';
const productModel = Models.product;
import createSlug from '../helpers/createSlug';
const brandModel= Models.brand;
const product_categoryModel = Models.product_category;
class productService {
   
    async getAll(){
        try {
            const products = productModel.findAll();
             return products
        } catch (err) {
            console.log('🚀 ~ file: product.service.js ~ method getAll ~ productService ~ error', error);
            return null;
        }
    }
    async getAllJoin(){
      const products = productModel.findAll({ include:{model: brandModel, as :'BRAND' },include:{model: product_categoryModel,as:'product_categories'}});
      const brands= brandModel.findAll();
      const product_category = product_categoryModel.findAll();
      return products;
      // return Promise.all([products,brands,product_category])
      // .then((data)=>{
      //  let productList = {};
      //  console.log(data);
      //  return productList;
       
      // })
      // .catch((err)=>{
      //   console.log(err);
      // });
    }
    async save(data){
      try {
        const product = await productModel.create({
          name:data.name,
          isSelling:data.isSelling,
          sellStartDate: data.date,
          price: data.price,
          suitableFor: data.sex,
          specifications: data.detail,
          description: data.des,
          BRAND_ID: data.brand,
          slug: this.createSlug(data.name),
          })
          return product;
    } catch (err) {
        console.log('🚀 ~ file: product.service.js ~ method save ~ productService ~ error', err);
        return null;
    }   
    }
}
module.exports = new productService;