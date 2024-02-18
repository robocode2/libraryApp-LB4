'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('list', {
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
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID, // xx or UIDV4
        notEmpty: true,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('list');
  },
};
