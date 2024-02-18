'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entries extends Model {}

  Entries.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      ListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      BookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: 'entries',
      modelName: 'Entries',
    }
  );
  return Entries;
};
