'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class List extends Model {
    static associate(models) {
      List.belongsToMany(models.Book, { through: 'Entries', as: 'Booklists' });
    }
  }
  List.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          len: {
            args: [1, 150],
            msg: 'Please enter a list name between 1 and 100 charcters',
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        notEmpty: true,
        validate: {
          len: {
            args: [1, 150],
            msg: 'Please enter a list description between 1 and 100 charcters',
          },
        },
      },
    },

    {
      sequelize,
      tableName: 'list',
      modelName: 'List',
    }
  );
  return List;
};
