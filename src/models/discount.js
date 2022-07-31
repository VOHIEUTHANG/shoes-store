const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('discount', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    percentReduction: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    isApply: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    PRODUCT_ID: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'product',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'discount',
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
        name: "fk_DISCOUNT_PRODUCT1_idx",
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ID" },
        ]
      },
    ]
  });
};
