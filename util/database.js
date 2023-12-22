const Sequelize = require("sequelize");

const sequelize = new Sequelize("postgres:/sql.com:5432/iygrhdhb");

module.exports = sequelize;
