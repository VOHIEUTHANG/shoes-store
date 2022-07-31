const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('refresh_tokens', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    refreshToken: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    userName: {
      type: DataTypes.STRING(30),
      allowNull: true,
      references: {
        model: 'user',
        key: 'userName'
      }
    }
  }, {
    sequelize,
    tableName: 'refresh_tokens',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "userName",
        using: "BTREE",
        fields: [
          { name: "userName" },
        ]
      },
    ]
  });
};
