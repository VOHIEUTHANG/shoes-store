const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wish_list', {
    PRODUCT_ID: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'product',
        key: 'ID'
      }
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'username'
      }
    }
  }, {
    sequelize,
    tableName: 'wish_list',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ID" },
          { name: "username" },
        ]
      },
      {
        name: "fk_PRODUCT_has_USER_USER2_idx",
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "fk_PRODUCT_has_USER_PRODUCT2_idx",
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ID" },
        ]
      },
    ]
  });
};
