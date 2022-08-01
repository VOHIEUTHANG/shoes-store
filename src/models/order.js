const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      references: {
        model: 'user',
        key: 'username'
      }
    },
    totalMoney: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    diliveryStatus: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    orderStatus: {
      type: DataTypes.ENUM('processing','cancle','success'),
      allowNull: true
    },
    orderTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    paymentTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DELIVERY_ADDRESS_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'delivery_address',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'order',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
          { name: "DELIVERY_ADDRESS_ID" },
        ]
      },
      {
        name: "fk_ORDER_USER1_idx",
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "fk_ORDER_DELIVERY_ADDRESS1_idx",
        using: "BTREE",
        fields: [
          { name: "DELIVERY_ADDRESS_ID" },
        ]
      },
    ]
  });
};
