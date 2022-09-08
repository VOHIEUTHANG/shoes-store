import sequelize, { Op } from 'sequelize';
import Models from '../database/sequelize';
import createSlug from '../helpers/createSlug';
import formatCurrency from '../helpers/formatCurrency';
import { calculatePriceAfterApplyDiscount, calculateDiscountPrice } from '../helpers/discountHandler';
const productModel = Models.product;
const categoryModel = Models.category;
const brandModel = Models.brand;
const productCategoryModel = Models.product_category;
const productImagesModel = Models.product_images;
const productItemModel = Models.product_items;
const discountModel = Models.discount;
const productReviewModel = Models.product_review;
const userModel = Models.user;
const accountModel = Models.account;

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
   async getAllJoin(lim,offset) {
      let products = productModel.findAll({
         include: [
            { model: brandModel, as: 'BRAND' },
            {
               model: productCategoryModel,
               as: 'product_categories',
               include: [{ model: categoryModel, as: 'CATEGORY' }],
            },
         ],
         limit: lim,
         offset: offset
      });
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
   async update(data) {
      try {
         let product = await productModel.upsert({
            ID: data.id,
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
         console.log('🚀 ~ file: product.service.js ~ method update ~ productService ~ error', err);
         return null;
      }
   }
   async getOneJoin(id) {
      let product = productModel.findOne({
         include: [
            { model: brandModel, as: 'BRAND' },
            {
               model: productCategoryModel,
               as: 'product_categories',
               include: [{ model: categoryModel, as: 'CATEGORY' }],
            },
         ],
         where: { ID: id },
      });
      return product;
   }

   async getActiveProduct({
      offset = 0,
      limit = 5,
      sort,
      search,
      priceRange,
      cateID,
      size,
      discount,
      brandID,
      isGetlatestProduct,
      suitableFor = 'both',
      excluded,
   }) {
      const queryConditions = { isSelling: true };
      const productCategoryConditions = {};
      const sizeAvaliableConditions = {};
      const belongToCertainBrandConditions = {};
      const timeNow = new Date();
      if (search) {
         queryConditions.name = {
            [Op.like]: `%${search}%`,
         };
      }
      if (brandID) {
         belongToCertainBrandConditions.ID = brandID;
      }
      if (priceRange) {
         queryConditions.price = {
            [Op.gte]: Number(priceRange.priceFrom) * 100,
            [Op.lte]: Number(priceRange.priceTo) * 100,
         };
      }
      if ((suitableFor === 'male', suitableFor === 'female')) {
         queryConditions.suitableFor = suitableFor;
      }
      if (excluded) {
         queryConditions.slug = {
            [Op.ne]: excluded.slug,
         };
      }
      if (cateID && cateID !== 'all') {
         productCategoryConditions.CATEGORY_ID = cateID;
      }
      if (size && size !== '~') {
         sizeAvaliableConditions.size = size;
         sizeAvaliableConditions.inventory = {
            [Op.gt]: 0,
         };
      }

      try {
         const queryOptions = {
            attributes: {
               exclude: ['BRAND_ID', 'sellStartDate', 'specifications', 'descriptions'],
            },
            distinct: true,
            include: [
               {
                  model: brandModel,
                  as: 'BRAND',
                  where: belongToCertainBrandConditions,
               },
               {
                  model: productImagesModel,
                  as: 'product_images',
               },
               {
                  model: productCategoryModel,
                  as: 'product_categories',
                  where: productCategoryConditions,
               },
               {
                  model: productItemModel,
                  as: 'product_items',
                  where: sizeAvaliableConditions,
               },
               {
                  model: discountModel,
                  required: discount === 'true' ? true : false,
                  as: 'discounts',
                  where: {
                     isApply: true,
                     [Op.and]: [sequelize.where(sequelize.fn('date', sequelize.col('endDate')), '>', timeNow)],
                  },
               },
            ],
            where: queryConditions,
            limit: limit,
            offset: offset,
         };
         if (sort == 'ASC' || sort == 'DESC') {
            queryOptions.order = [['price', sort]];
         }
         if (isGetlatestProduct) {
            const orderOption = ['sellStartDate', 'DESC'];
            queryOptions.order = queryOptions.order ? [...queryOptions.order, orderOption] : [orderOption];
         }
         console.log('queryOptions.order', queryOptions.order);
         const { count, rows } = await productModel.findAndCountAll(queryOptions);
         let products = rows.map((product) => ({
            ...product.dataValues,
            BRAND: product.dataValues.BRAND.brandName,
            brandID: product.dataValues.BRAND.ID,
            product_images: product.dataValues.product_images[0]?.imageURL,
            price: product.dataValues.price,
            discounts: product.dataValues?.discounts[0]?.dataValues || null,
         }));
         const calculatePriceAfterDiscount = products.map((product) => {
            return {
               ...product,
               price: formatCurrency(product.price * 1000),
               discounts: !!product.discounts
                  ? {
                       ...product.discounts,
                       priceAfterApplyDiscount: formatCurrency(
                          calculatePriceAfterApplyDiscount(product.price, product.discounts.percentReduction),
                       ),
                       discountPrice: formatCurrency(
                          calculateDiscountPrice(product.price, product.discounts.percentReduction),
                       ),
                    }
                  : null,
            };
         });
         console.log('calculatePriceAfterDiscount', calculatePriceAfterDiscount);
         return { total: count, products: calculatePriceAfterDiscount };
      } catch (error) {
         console.log('🚀 ~ file: product.service.js ~ line 63 ~ productService ~ error', error);
         return null;
      }
   }
   async insertProductComment({ userName, productID, content, imageURL }) {
      try {
         const insertResult = await productReviewModel.create({
            username: userName,
            PRODUCT_ID: productID,
            content: content,
            imageURL: imageURL ? imageURL : null,
         });
         return insertResult?.dataValues.id;
      } catch (error) {
         return false;
      }
   }
   async getAllProductCommentsByID(PRODUCT_ID, username) {
      if (PRODUCT_ID) {
         try {
            const comments = await productReviewModel.findAll({
               where: {
                  PRODUCT_ID,
               },
               include: [
                  {
                     model: userModel,
                     as: 'username_user',
                     include: {
                        model: accountModel,
                        as: 'username_account',
                     },
                  },
               ],
               order: [['id', 'DESC']],
            });

            const formatedComments = comments?.map((comment) => {
               return {
                  ID: comment.dataValues.id,
                  username: comment.dataValues.username,
                  userAvatar: comment.dataValues.username_user.dataValues.username_account.dataValues.avatar,
                  content: comment.dataValues.content,
                  imageURL: comment.dataValues.imageURL,
                  isBelongCurrentUser: comment.dataValues.username === username,
               };
            });
            return formatedComments;
         } catch (error) {
            console.log('🚀 ~ file: product.service.js ~ line 255 ~ productService ~ error', error);
            return null;
         }
      } else {
         return null;
      }
   }
   async deleteCommentByID(commentID, username) {
      if (commentID && username) {
         try {
            const deletResult = await productReviewModel.destroy({
               where: {
                  id: commentID,
                  username,
               },
            });
            console.log('deletResult ===> ', deletResult);
            return true;
         } catch (error) {
            return false;
         }
      }
      return false;
   }
   async getLatestProduct() {
      const timeNow = new Date();
      const productList = await productModel.findAll({
         where: {
            isSelling: true,
         },
         include: [
            {
               model: brandModel,
               as: 'BRAND',
            },
            {
               model: productImagesModel,
               as: 'product_images',
            },
            {
               model: discountModel,
               required: false,
               as: 'discounts',
               where: {
                  isApply: true,
                  [Op.and]: [sequelize.where(sequelize.fn('date', sequelize.col('endDate')), '>', timeNow)],
               },
            },
         ],
         order: [['sellStartDate', 'DESC']],
         limit: 5,
      });
      const formatedProductList = productList.map((product) => {
         return {
            ID: product.dataValues.ID,
            name: product.dataValues.name,
            price: product.dataValues.price,
            slug: product.dataValues.slug,
            brandName: product.dataValues.BRAND?.dataValues.brandName,
            brandID: product.dataValues.BRAND?.dataValues.ID,
            product_images: product.dataValues.product_images[0].dataValues.imageURL,
            discounts: product.dataValues?.discounts[0]?.dataValues || null,
         };
      });
      const calculatePriceAfterDiscount = formatedProductList.map((product) => {
         return {
            ...product,
            price: formatCurrency(product.price * 1000),
            discounts: !!product.discounts
               ? {
                    ...product.discounts,
                    priceAfterApplyDiscount: formatCurrency(
                       calculatePriceAfterApplyDiscount(product.price, product.discounts.percentReduction),
                    ),
                    discountPrice: formatCurrency(
                       calculateDiscountPrice(product.price, product.discounts.percentReduction),
                    ),
                 }
               : null,
         };
      });
      return calculatePriceAfterDiscount;
   }
   async getAllProductByBrand(brandID) {
      if (brandID) {
         try {
            const produtList = await productModel.findAll({
               include: [
                  {
                     model: brandModel,
                     as: 'BRAND',
                     required: true,
                     where: {
                        ID: brandID,
                     },
                  },
               ],
            });
         } catch (error) {}
      } else {
      }
   }
   async getTotalOfProductCount() {
      const count = await productModel.count({
         where: { isSelling: 1 },
      });
      return count;
   }
   async getDetailProductBySlug(slug) {
      const timeNow = new Date();
      try {
         const productResult = await productModel.findOne({
            attributes: {
               exclude: ['BRAND_ID', 'sellStartDate'],
            },
            include: [
               {
                  model: brandModel,
                  as: 'BRAND',
               },
               {
                  model: productImagesModel,
                  as: 'product_images',
               },
               {
                  model: productItemModel,
                  as: 'product_items',
                  attributes: ['inventory', 'size', 'ID'],
               },
               {
                  model: discountModel,
                  as: 'discounts',
                  required: false,
                  where: {
                     isApply: true,
                     [Op.and]: [sequelize.where(sequelize.fn('date', sequelize.col('endDate')), '>', timeNow)],
                  },
               },
            ],
            where: { slug: slug },
         });
         if (productResult) {
            const formatedProduct = {
               ...productResult.dataValues,
               BRAND: productResult.dataValues.BRAND.dataValues.brandName,
               product_images: productResult.dataValues.product_images.map((img) => {
                  return img.imageURL;
               }),
               price: formatCurrency(productResult.dataValues.price * 1000),
               product_items: productResult.dataValues.product_items.map((product) => {
                  return product.dataValues;
               }),
               discounts:
                  productResult.dataValues.discounts.length > 0
                     ? {
                          percentReduction: productResult.dataValues.discounts[0].dataValues?.percentReduction,
                          priceAfterApplyDiscount: formatCurrency(
                             calculatePriceAfterApplyDiscount(
                                productResult.dataValues.price,
                                productResult.dataValues.discounts[0].dataValues.percentReduction,
                             ),
                          ),
                       }
                     : null,
            };
            return formatedProduct;
         } else {
            return null;
         }
      } catch (error) {
         console.log('🚀 ~ file: product.service.js ~ line 109 ~ productService ~ error', error);
         return false;
      }
   }
   async getRelatedProductBySlug(slug) {
      if (slug) {
         try {
            const targetProduct = await productModel.findOne({
               where: {
                  slug,
               },
               include: [
                  {
                     model: brandModel,
                     as: 'BRAND',
                  },
                  {
                     model: categoryModel,
                     as: 'belong_category',
                  },
               ],
               attributes: ['BRAND_ID', 'suitableFor'],
            });
            const branIDAndCategoryIDOfTargetProduct = {
               brandID: targetProduct.dataValues.BRAND_ID,
               suitableFor: targetProduct.dataValues.suitableFor,
               categoryID:
                  targetProduct.dataValues.belong_category.length > 0
                     ? targetProduct.dataValues.belong_category[0].dataValues.ID
                     : null,
            };
            const relatedProductOptions = {
               suitableFor: branIDAndCategoryIDOfTargetProduct.suitableFor,
               excluded: { slug },
            };
            if (branIDAndCategoryIDOfTargetProduct.brandID)
               relatedProductOptions.brandID = branIDAndCategoryIDOfTargetProduct.brandID;
            if (branIDAndCategoryIDOfTargetProduct.categoryID)
               relatedProductOptions.cateID = branIDAndCategoryIDOfTargetProduct.categoryID;

            const relatedProducts = await this.getActiveProduct(relatedProductOptions);
            const relatedProductsFormated = relatedProducts.products.map((product) => {
               const { product_categories, product_items, ...neededProperties } = product;
               return neededProperties;
            });
            return relatedProductsFormated;
         } catch (error) {
            console.log('🚀 ~ file: product.service.js ~ line 367 ~ productService ~ error', error);
            return null;
         }
      }
   }
   async countProduct(){
      try {
         const count = await productModel.count();
         return count;
      } catch (error) {
         return null;
         console.log('🚀 ~ file: product.service.js ~ line 367 ~ productService ~ error', error);
      }
   }
}

module.exports = new productService();
