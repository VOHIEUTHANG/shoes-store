const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    ID: {
      autoIncrement: true,
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    isSelling: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    sellStartDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    suitableFor: {
      type: DataTypes.ENUM('male','female','both'),
      allowNull: true
    },
    BRAND_ID: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'brand',
        key: 'ID'
      }
    },
    desc: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    detail: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'product',
    hasTrigger: true,
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
        name: "fk_PRODUCT_BRAND1_idx",
        using: "BTREE",
        fields: [
          { name: "BRAND_ID" },
        ]
      },
    ]
  });
};
