/* 'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'list',
      [
        {
          name: 'favourites seed',
          description: 'my favourites books',
          userId: 'FaAMohHFTwftFrApJnjcEt640k92',
        },
      ],
      {}
    ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('list', null, {}),
};
 */