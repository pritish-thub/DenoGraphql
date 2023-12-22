const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const User = require("../../model/user");
const BankDetails = require("../../model/bankDetails");

module.exports = {
  Query: {
    getProfile: async (parent, args, context, info) => {
      try {
        const { user } = context;
        const emailId = user ? user.emailId : "";
        const tempUser = await User.findOne({ where: { emailId } });
        if (!tempUser) {
          throw new AuthenticationError("Unauthenticated");
        }

        const bankDetails = await BankDetails.findAll({
          where: { userId: tempUser.id },
        });

        return {
          user: tempUser,
          bankDetails: bankDetails.length > 0 ? bankDetails[0] : null,
        };
      } catch (err) {
        throw err;
      }
    },
  },
  //   Mutation: {},
};
