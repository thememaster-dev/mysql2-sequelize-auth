const Sequelize = require("sequelize");
const dotenv = require("dotenv").config();

//data base info from .env
const dataBase = process.env.DATABASE_NAME;
const user = process.env.DB_USERNAME;
const pass = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const dialect = process.env.SEQUELIZE_DIALECT;

const sequelize = new Sequelize(dataBase, user, pass, {
  dialect: dialect,
  host: host,
});

module.exports = sequelize;
