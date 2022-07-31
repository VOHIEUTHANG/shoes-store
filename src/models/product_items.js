const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_items', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    PRODUCT_ID: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'product',
        key: 'ID'
      }
    },
    inventory: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    size: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'product_items',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "fk_PRODUCT_ITEMS_PRODUCT1_idx",
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ID" },
        ]
      },
    ]
  });
};
