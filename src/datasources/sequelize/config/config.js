require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL, // trick to reset test db : TEST_DATABASE_URL
    dialect: 'postgres',
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    ssl: { rejectUnauthorized: false },
  },
};