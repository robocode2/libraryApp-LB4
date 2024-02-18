'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsToMany(models.List, { through: 'Entries', as: 'Books' });
    }
  }
  Book.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          len: {
            args: [1, 150],
            msg: 'Please enter a title between 1 and 250 charcters ',
          },
        },
      },
      isbn: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          len: {
            args: [13],
            msg: 'Please enter isbn 13 charcters ',
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
            msg: 'Please enter book description',
          },
        },
      },
    },
    {
      sequelize,
      tableName: 'book',
      modelName: 'Book',
    }
  );
  return Book;
};
