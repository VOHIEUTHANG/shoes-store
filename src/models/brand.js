const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('brand', {
    ID: {
      autoIncrement: true,
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    brandName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    popularLevel: {
      type: DataTypes.ENUM('very_popular','popular','medium','low','anonymous'),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'brand',
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
    ]
  });
};
