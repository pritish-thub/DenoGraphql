const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Investment = sequelize.define("InvestmentList", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  month: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  percentage: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Investment;
