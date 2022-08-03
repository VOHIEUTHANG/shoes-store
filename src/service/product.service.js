import Models from '../database/sequelize';
const productModel = Models.product;
class productService {
    createslug(str){   
            str = str.replace(/^\s+|\s+$/g, ''); // trim
            str = str.toLowerCase();
          
            // remove accents, swap ñ for n, etc
            var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
            var to   = "aaaaaeeeeeiiiiooooouuuunc------";
            for (var i = 0, l = from.length; i < l; i++) {
              str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }
          
            str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                     .replace(/\s+/g, '-') // collapse whitespace and replace by -
                     .replace(/-+/g, '-'); // collapse dashes
          
            return str;
          
    }
    async getAll(){
        try {
            const products = productModel.findAll();
             return products
        } catch (err) {
            console.log('🚀 ~ file: product.service.js ~ line 8 ~ productService ~ error', error);
            return null;
        }
    }
    async save(data){
      const product = await productModel.create({
      name:data.name,
      isSelling:data.isSelling,
      sellStartDate: data.date,
      price: data.price,
      suitableFor: data.sex,
      specifications: data.detail,
      description: data.description,
      BRAND_ID: 10,
      slug: this.createslug(data.name),
      })
      return product;
    }
}
module.exports = new productService;