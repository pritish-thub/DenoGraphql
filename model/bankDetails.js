const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const BankDetails = sequelize.define("BankDetails", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  bankName: { type: Sequelize.STRING, allowNull: false },
  accountNumber: { type: Sequelize.STRING, allowNull: false },
  bankSwift: { type: Sequelize.STRING, allowNull: false },
  branchCode: { type: Sequelize.STRING, allowNull: false },
});

module.exports = BankDetails;
