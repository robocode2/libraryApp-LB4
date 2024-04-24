const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(`${process.env.DEV_DB}`, `${process.env.DB_USER}`, `${process.env.DB_PASSWD}`, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

module.exports = sequelize;
