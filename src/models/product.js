const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
   return sequelize.define(
      'product',
      {
         ID: {
            autoIncrement: true,
            type: DataTypes.SMALLINT,
            allowNull: false,
            primaryKey: true,
         },
         name: {
            type: DataTypes.STRING(80),
            allowNull: true,
         },
         isSelling: {
            type: DataTypes.TINYINT,
            allowNull: false,
         },
         sellStartDate: {
            type: DataTypes.DATE,
            allowNull: true,
         },
         price: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         slug: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: 'slug_UNIQUE',
         },
         suitableFor: {
            type: DataTypes.ENUM('male', 'female', 'both'),
            allowNull: true,
         },
         BRAND_ID: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            references: {
               model: 'brand',
               key: 'ID',
            },
         },
         specifications: {
            type: DataTypes.STRING(300),
            allowNull: true,
         },
         descriptions: {
            type: DataTypes.STRING(2000),
            allowNull: true,
         },
      },
      {
         sequelize,
         tableName: 'product',
         hasTrigger: true,
         timestamps: false,
         indexes: [
            {
               name: 'PRIMARY',
               unique: true,
               using: 'BTREE',
               fields: [{ name: 'ID' }],
            },
            {
               name: 'slug_UNIQUE',
               unique: true,
               using: 'BTREE',
               fields: [{ name: 'slug' }],
            },
            {
               name: 'fk_PRODUCT_BRAND1_idx',
               using: 'BTREE',
               fields: [{ name: 'BRAND_ID' }],
            },
         ],
      },
   );
};
