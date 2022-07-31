const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('price_adjustment', {
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
    adjustmentTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'price_adjustment',
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
        name: "fk_PRICE_ADJUSTMENT_PRODUCT1_idx",
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ID" },
        ]
      },
    ]
  });
};
