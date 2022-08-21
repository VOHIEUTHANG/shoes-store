const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
   return sequelize.define(
      'category',
      {
         ID: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
         },
         name: {
            type: DataTypes.STRING(100),
            allowNull: false,
         },
         descriptions: {
            type: DataTypes.STRING(100),
            allowNull: true,
         },
      },
      {
         sequelize,
         tableName: 'category',
         timestamps: false,
         indexes: [
            {
               name: 'PRIMARY',
               unique: true,
               using: 'BTREE',
               fields: [{ name: 'ID' }],
            },
         ],
      },
   );
};
