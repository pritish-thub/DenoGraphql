const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const Investment = require("../../model/investment");
const User = require("../../model/user");

module.exports = {
  Query: {
    getInvestment: async (parent, args, context, info) => {
      try {
        const { user } = context;
        const emailId = user ? user.emailId : "";
        const tempUser = await User.findOne({ where: { emailId } });
        if (!tempUser) {
          throw new AuthenticationError("Unauthenticated");
        }
        const investments = await Investment.findAll({});
        return investments;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    addInvestment: async (parent, args, context, info) => {
      const { month, percentage } = args;
      const { user } = context;
      const emailId = user ? user.emailId : "";
      const tempUser = await User.findOne({ where: { emailId } });
      if (!tempUser) {
        throw new AuthenticationError("Unauthenticated");
      }

      if (!month) {
        throw new UserInputError("Month must not be empty");
      }

      if (!percentage) {
        throw new UserInputError("Percentage must not be empty");
      }

      const investment = await Investment.create({
        month,
        percentage,
      });

      return investment;
    },
    calculateInvestment: async (parent, args, context, info) => {
      const { month, percentage } = args;
      const { user } = context;
      const emailId = user ? user.emailId : "";
      const tempUser = await User.findOne({ where: { emailId } });
      if (!tempUser) {
        throw new AuthenticationError("Unauthenticated");
      }

      if (!month) {
        throw new UserInputError("Month must not be empty");
      }

      if (!percentage) {
        throw new UserInputError("Percentage must not be empty");
      }

      const calculateAmount = (month / percentage) * 100;
      return calculateAmount;
    },
  },
};
