'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('entry', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      bookId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      listId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('entry');
  },
};
