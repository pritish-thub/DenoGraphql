const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const BankDetails = require("../../model/bankDetails");
const User = require("../../model/user");

module.exports = {
  Query: {
    getAllBankNames: async (parent, args, context, info) => {
      try {
        const { user } = context;
        const emailId = user ? user.emailId : "";
        const tempUser = await User.findOne({ where: { emailId } });
        if (!tempUser) {
          throw new AuthenticationError("Unauthenticated");
        }
        const bankDetails = await BankDetails.findAll({
          attributes: ["id", "bankName"],
        });
        return bankDetails;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    addBankDetails: async (parent, args, context, info) => {
      try {
        const { bankName, accountNumber, bankSwift, branchCode } = args;
        const { user } = context;
        const emailId = user ? user.emailId : "";
        const tempUser = await User.findOne({ where: { emailId } });
        if (!tempUser) {
          throw new AuthenticationError("Unauthenticated");
        }

        if (bankName.trim() === "") {
          throw new UserInputError("Bank Name must not be empty");
        }

        if (accountNumber.trim() === "") {
          throw new UserInputError("Bank Name must not be empty");
        }

        if (bankSwift.trim() === "") {
          throw new UserInputError("Bank Name must not be empty");
        }

        if (branchCode.trim() === "") {
          throw new UserInputError("Bank Name must not be empty");
        }

        const bankDetails = await BankDetails.create({
          userId: tempUser.id,
          bankName,
          accountNumber,
          bankSwift,
          branchCode,
        });
        return bankDetails;
      } catch (err) {
        throw err;
      }
    },
  },
};
