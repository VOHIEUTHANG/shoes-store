const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_category', {
    PRODUCT_ID: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'product',
        key: 'ID'
      }
    },
    CATEGORY_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'category',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'product_category',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ID" },
          { name: "CATEGORY_ID" },
        ]
      },
      {
        name: "fk_PRODUCT_has_CATEGORY_CATEGORY1_idx",
        using: "BTREE",
        fields: [
          { name: "CATEGORY_ID" },
        ]
      },
      {
        name: "fk_PRODUCT_has_CATEGORY_PRODUCT1_idx",
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ID" },
        ]
      },
    ]
  });
};
