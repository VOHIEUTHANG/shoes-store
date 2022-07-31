const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_detail', {
    PRODUCT_ITEMS_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'product_items',
        key: 'ID'
      }
    },
    ORDER_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'order',
        key: 'ID'
      }
    },
    quantity: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discount_percent: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    intoMoney: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'order_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ITEMS_ID" },
          { name: "ORDER_ID" },
        ]
      },
      {
        name: "fk_PRODUCT_ITEMS_has_ORDER_ORDER1_idx",
        using: "BTREE",
        fields: [
          { name: "ORDER_ID" },
        ]
      },
      {
        name: "fk_PRODUCT_ITEMS_has_ORDER_PRODUCT_ITEMS1_idx",
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ITEMS_ID" },
        ]
      },
    ]
  });
};
