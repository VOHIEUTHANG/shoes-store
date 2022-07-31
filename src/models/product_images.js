const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_images', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    imageURL: {
      type: DataTypes.STRING(300),
      allowNull: false
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
    tableName: 'product_images',
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
        name: "fk_PRODUCT_IMAGES_PRODUCT1_idx",
        using: "BTREE",
        fields: [
          { name: "PRODUCT_ID" },
        ]
      },
    ]
  });
};
