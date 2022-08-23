import { DataTypes } from 'sequelize';
import _account from './account';
import _brand from './brand';
import _cart from './cart';
import _category from './category';
import _delivery_address from './delivery_address';
import _discount from './discount';
import _employee from './employee';
import _order from './order';
import _order_detail from './order_detail';
import _price_adjustment from './price_adjustment';
import _product from './product';
import _product_category from './product_category';
import _product_images from './product_images';
import _product_items from './product_items';
import _product_rating from './product_rating';
import _product_review from './product_review';
import _refresh_tokens from './refresh_tokens';
import _role from './role';
import _user from './user';
import _wish_list from './wish_list';

export default function initModels(sequelize) {
   const account = _account(sequelize, DataTypes);
   const brand = _brand(sequelize, DataTypes);
   const cart = _cart(sequelize, DataTypes);
   const category = _category(sequelize, DataTypes);
   const delivery_address = _delivery_address(sequelize, DataTypes);
   const discount = _discount(sequelize, DataTypes);
   const employee = _employee(sequelize, DataTypes);
   const order = _order(sequelize, DataTypes);
   const order_detail = _order_detail(sequelize, DataTypes);
   const price_adjustment = _price_adjustment(sequelize, DataTypes);
   const product = _product(sequelize, DataTypes);
   const product_category = _product_category(sequelize, DataTypes);
   const product_images = _product_images(sequelize, DataTypes);
   const product_items = _product_items(sequelize, DataTypes);
   const product_rating = _product_rating(sequelize, DataTypes);
   const product_review = _product_review(sequelize, DataTypes);
   const refresh_tokens = _refresh_tokens(sequelize, DataTypes);
   const role = _role(sequelize, DataTypes);
   const user = _user(sequelize, DataTypes);
   const wish_list = _wish_list(sequelize, DataTypes);

   category.belongsToMany(product, {
      as: 'PRODUCT_ID_products',
      through: product_category,
      foreignKey: 'CATEGORY_ID',
      otherKey: 'PRODUCT_ID',
   });
   order.belongsToMany(product_items, {
      as: 'PRODUCT_ITEMS_ID_product_items_order_details',
      through: order_detail,
      foreignKey: 'ORDER_ID',
      otherKey: 'PRODUCT_ITEMS_ID',
   });
   product.belongsToMany(category, {
      as: 'belong_category',
      through: product_category,
      foreignKey: 'PRODUCT_ID',
      otherKey: 'CATEGORY_ID',
   });
   product.belongsToMany(user, {
      as: 'username_user_product_ratings',
      through: product_rating,
      foreignKey: 'PRODUCT_ID',
      otherKey: 'username',
   });
   product.belongsToMany(user, {
      as: 'username_user_product_reviews',
      through: product_review,
      foreignKey: 'PRODUCT_ID',
      otherKey: 'username',
   });
   product.belongsToMany(user, {
      as: 'username_user_wish_lists',
      through: wish_list,
      foreignKey: 'PRODUCT_ID',
      otherKey: 'username',
   });
   product_items.belongsToMany(order, {
      as: 'ORDER_ID_orders',
      through: order_detail,
      foreignKey: 'PRODUCT_ITEMS_ID',
      otherKey: 'ORDER_ID',
   });
   product_items.belongsToMany(user, {
      as: 'username_users',
      through: cart,
      foreignKey: 'PRODUCT_ITEMS_ID',
      otherKey: 'username',
   });
   user.belongsToMany(product, {
      as: 'PRODUCT_ID_product_product_ratings',
      through: product_rating,
      foreignKey: 'username',
      otherKey: 'PRODUCT_ID',
   });
   user.belongsToMany(product, {
      as: 'PRODUCT_ID_product_product_reviews',
      through: product_review,
      foreignKey: 'username',
      otherKey: 'PRODUCT_ID',
   });
   user.belongsToMany(product, {
      as: 'PRODUCT_ID_product_wish_lists',
      through: wish_list,
      foreignKey: 'username',
      otherKey: 'PRODUCT_ID',
   });
   user.belongsToMany(product_items, {
      as: 'PRODUCT_ITEMS_ID_product_items',
      through: cart,
      foreignKey: 'username',
      otherKey: 'PRODUCT_ITEMS_ID',
   });
   employee.belongsTo(account, { as: 'username_account', foreignKey: 'username' });
   account.hasOne(employee, { as: 'employee', foreignKey: 'username' });
   user.belongsTo(account, { as: 'username_account', foreignKey: 'username' });
   account.hasOne(user, { as: 'user', foreignKey: 'username' });
   product.belongsTo(brand, { as: 'BRAND', foreignKey: 'BRAND_ID' });
   brand.hasMany(product, { as: 'products', foreignKey: 'BRAND_ID' });
   product_category.belongsTo(category, { as: 'CATEGORY', foreignKey: 'CATEGORY_ID' });
   category.hasMany(product_category, { as: 'product_categories', foreignKey: 'CATEGORY_ID' });
   order.belongsTo(delivery_address, { as: 'DELIVERY_ADDRESS', foreignKey: 'DELIVERY_ADDRESS_ID' });
   delivery_address.hasMany(order, { as: 'orders', foreignKey: 'DELIVERY_ADDRESS_ID' });
   order_detail.belongsTo(order, { as: 'ORDER', foreignKey: 'ORDER_ID' });
   order.hasMany(order_detail, { as: 'order_details', foreignKey: 'ORDER_ID' });
   discount.belongsTo(product, { as: 'PRODUCT', foreignKey: 'PRODUCT_ID' });
   product.hasMany(discount, { as: 'discounts', foreignKey: 'PRODUCT_ID' });
   price_adjustment.belongsTo(product, { as: 'PRODUCT', foreignKey: 'PRODUCT_ID' });
   product.hasMany(price_adjustment, { as: 'price_adjustments', foreignKey: 'PRODUCT_ID' });
   product_category.belongsTo(product, { as: 'PRODUCT', foreignKey: 'PRODUCT_ID' });
   product.hasMany(product_category, { as: 'product_categories', foreignKey: 'PRODUCT_ID' });
   product_images.belongsTo(product, { as: 'PRODUCT', foreignKey: 'PRODUCT_ID' });
   product.hasMany(product_images, { as: 'product_images', foreignKey: 'PRODUCT_ID' });
   product_items.belongsTo(product, { as: 'PRODUCT', foreignKey: 'PRODUCT_ID' });
   product.hasMany(product_items, { as: 'product_items', foreignKey: 'PRODUCT_ID' });
   product_rating.belongsTo(product, { as: 'PRODUCT', foreignKey: 'PRODUCT_ID' });
   product.hasMany(product_rating, { as: 'product_ratings', foreignKey: 'PRODUCT_ID' });
   product_review.belongsTo(product, { as: 'PRODUCT', foreignKey: 'PRODUCT_ID' });
   product.hasMany(product_review, { as: 'product_reviews', foreignKey: 'PRODUCT_ID' });
   wish_list.belongsTo(product, { as: 'PRODUCT', foreignKey: 'PRODUCT_ID' });
   product.hasMany(wish_list, { as: 'wish_lists', foreignKey: 'PRODUCT_ID' });
   cart.belongsTo(product_items, { as: 'PRODUCT_ITEM', foreignKey: 'PRODUCT_ITEMS_ID' });
   product_items.hasMany(cart, { as: 'carts', foreignKey: 'PRODUCT_ITEMS_ID' });
   order_detail.belongsTo(product_items, { as: 'PRODUCT_ITEM', foreignKey: 'PRODUCT_ITEMS_ID' });
   product_items.hasMany(order_detail, { as: 'order_details', foreignKey: 'PRODUCT_ITEMS_ID' });
   cart.belongsTo(user, { as: 'username_user', foreignKey: 'username' });
   user.hasMany(cart, { as: 'carts', foreignKey: 'username' });
   delivery_address.belongsTo(user, { as: 'username_user', foreignKey: 'username' });
   user.hasMany(delivery_address, { as: 'delivery_addresses', foreignKey: 'username' });
   order.belongsTo(user, { as: 'username_user', foreignKey: 'username' });
   user.hasMany(order, { as: 'orders', foreignKey: 'username' });
   product_rating.belongsTo(user, { as: 'username_user', foreignKey: 'username' });
   user.hasMany(product_rating, { as: 'product_ratings', foreignKey: 'username' });
   product_review.belongsTo(user, { as: 'username_user', foreignKey: 'username' });
   user.hasMany(product_review, { as: 'product_reviews', foreignKey: 'username' });
   refresh_tokens.belongsTo(user, { as: 'username_user', foreignKey: 'username' });
   user.hasMany(refresh_tokens, { as: 'refresh_tokens', foreignKey: 'username' });
   wish_list.belongsTo(user, { as: 'username_user', foreignKey: 'username' });
   user.hasMany(wish_list, { as: 'wish_lists', foreignKey: 'username' });

   return {
      account,
      brand,
      cart,
      category,
      delivery_address,
      discount,
      employee,
      order,
      order_detail,
      price_adjustment,
      product,
      product_category,
      product_images,
      product_items,
      product_rating,
      product_review,
      refresh_tokens,
      role,
      user,
      wish_list,
   };
}
