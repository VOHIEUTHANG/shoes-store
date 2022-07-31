const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('employee', {
    userName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'account',
        key: 'userName'
      }
    },
    fullName: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    CCCD: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('Male','Female','Flex'),
      allowNull: false
    },
    salary: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    isWorking: {
      type: DataTypes.TINYINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'employee',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userName" },
        ]
      },
      {
        name: "fk_EMPLOYEE_INFO_ACCOUNT1_idx",
        using: "BTREE",
        fields: [
          { name: "userName" },
        ]
      },
    ]
  });
};
