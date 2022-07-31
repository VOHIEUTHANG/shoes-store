const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_rating', {
    PRODUCT_ID: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'product',
        key: 'ID'
      }
    },
    userName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'userName'
      }
    },
    starCount: {
      type: DataTypes.SMALLINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'product_rating',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ID" },
          { name: "userName" },
        ]
      },
      {
        name: "fk_PRODUCT_has_USER_USER1_idx",
        using: "BTREE",
        fields: [
          { name: "userName" },
        ]
      },
      {
        name: "fk_PRODUCT_has_USER_PRODUCT1_idx",
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ID" },
        ]
      },
    ]
  });
};
