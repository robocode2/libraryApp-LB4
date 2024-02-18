'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.List, { foreignKey: 'userid' });
    }
  }
  User.init(
    {
      userid: {
        allowNull: false,
        type: DataTypes.STRING,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      displayName: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: 'user',
      modelName: 'User',
    }
  );
  return User;
};
