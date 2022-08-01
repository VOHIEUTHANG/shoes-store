const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('delivery_address', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    province: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    district: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    wards: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    address_detail: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      references: {
        model: 'user',
        key: 'username'
      }
    }
  }, {
    sequelize,
    tableName: 'delivery_address',
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
        name: "fk_DELIVERY_ADDRESS_USER_INFO1_idx",
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
};
