'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        type: DataTypes.UUID, // xx or UIDV4
        defaultValue: DataTypes.UUIDV4, // I remember a porblem with this
        primaryKey: true,
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      role: {
        allowNull: false,
        type: DataTypes.ENUM('ADMIN', 'USER') //TODOX Specify with enum or something
      },
/*       verificationtoken: { //weird that it has to be burger case
        //optional
        type: DataTypes.STRING,
        allowNull: true, // This allows NULL values
        defaultValue: null, // This sets the default value to NULL
      },
      emailverified: { //weird that it has to be burger case
        //optional
        type: DataTypes.BOOLEAN,
        allowNull: true, // This allows NULL values
        defaultValue: null, // This sets the default value to NULL
      }, */
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('user');
  },
};
// There are many notes in the LB4 models, please read and manage it till completion