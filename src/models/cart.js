const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cart', {
    user_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'userName'
      }
    },
    PRODUCT_ITEMS_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'product_items',
        key: 'ID'
      }
    },
    quantity: {
      type: DataTypes.SMALLINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'cart',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_name" },
          { name: "PRODUCT_ITEMS_ID" },
        ]
      },
      {
        name: "fk_USER_INFO_has_PRODUCT_ITEMS_PRODUCT_ITEMS1_idx",
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ITEMS_ID" },
        ]
      },
      {
        name: "fk_USER_INFO_has_PRODUCT_ITEMS_USER_INFO1_idx",
        using: "BTREE",
        fields: [
          { name: "user_name" },
        ]
      },
    ]
  });
};
