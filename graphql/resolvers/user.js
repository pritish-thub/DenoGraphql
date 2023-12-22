const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../model/user");

const { JWT_SECRET } = require("../../config/env.json");

module.exports = {
  Query: {
    login: async (parent, args, context, info) => {
      const { emailId, password } = args;

      try {
        if (emailId.trim() === "") {
          throw new UserInputError("Email must not be empty");
        }
        if (password.trim() === "") {
          throw new UserInputError("Password must not be empty");
        }

        const user = await User.findOne({
          where: { emailId },
        });
        if (!user) {
          throw new UserInputError("User not found");
        }
        const correctPassword = await user.comparePassword(password);
        if (!correctPassword) {
          throw new UserInputError("Password is incorrect");
        }

        const token = jwt.sign(
          {
            emailId,
          },
          JWT_SECRET,
          { expiresIn: 60 * 60 }
        );
        return {
          ...user.toJSON(),
          token,
        };
      } catch (err) {
        throw err;
      }
    },
    registerOtp: async (parent, args, context, info) => {
      try {
        const { mobileNumber } = args;

        if (mobileNumber.trim() === "") {
          throw new UserInputError("Mobile number must not be provided");
        }

        const user = await User.findOne({
          where: { mobileNumber },
        });

        if (!user) {
          throw new UserInputError("User not found");
        }

        var tempNo = mobileNumber.substring(1, 7);
        var generatedNo = Math.floor(Math.random() * parseInt(tempNo) + 1);

        return {
          status: 1,
          otp: parseInt(generatedNo),
        };
      } catch (err) {
        throw err;
      }
    },
    loginOtp: async (parent, args, context, info) => {
      try {
        //
        const { email } = args;

        if (email.trim() === "") {
          throw new UserInputError("Mobile number must not be provided");
        }

        const user = await User.findOne({
          where: { emailId: email },
        });

        if (!user) {
          throw new UserInputError("User not found");
        }

        var tempNo = user.mobileNumber.substring(1, 7);
        var generatedNo = Math.floor(Math.random() * parseInt(tempNo) + 1);

        return {
          status: 1,
          otp: parseInt(generatedNo),
        };
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    register: async (parent, args, context, info) => {
      const { firstName, lastName, emailId, mobileNumber, password } = args;

      try {
        if (firstName.trim() === "") {
          throw new UserInputError("First name must not be empty");
        }
        if (lastName.trim() === "") {
          throw new UserInputError("Last name must not be empty");
        }
        if (emailId.trim() === "") {
          throw new UserInputError("Email id must not be empty");
        }
        if (mobileNumber.trim() === "") {
          throw new UserInputError("Mobile Number must not be empty");
        }
        if (password.trim() === "") {
          throw new UserInputError("Password must not be empty");
        }

        const userByMobileNumber = await User.findOne({
          where: { mobileNumber },
        });
        if (userByMobileNumber) {
          throw new UserInputError("Mobile number is taken");
        }
        const userByEmail = await User.findOne({ where: { emailId } });
        if (userByEmail) {
          throw new UserInputError("Email id is taken");
        }

        const user = await User.create({
          firstName,
          lastName,
          emailId,
          mobileNumber,
          password,
        });

        return user;
      } catch (err) {
        throw err;
      }
    },
    updatePassword: async (_, args, context, info) => {
      const { oldPassword, newPassword } = args;

      try {
        const { user } = context;
        const emailId = user ? user.emailId : "";
        const tempUser = await User.findOne({ where: { emailId } });
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }
        if (oldPassword.trim() === "") {
          throw new UserInputError("Old Password must not be empty");
        }

        if (newPassword.trim() === "") {
          throw new UserInputError("New Passowrd must not be empty");
        }

        const correctPassword = await tempUser.comparePassword(oldPassword);
        if (!correctPassword) {
          throw new UserInputError("Password is incorrect");
        }

        const salt = await bcrypt.genSalt(10);
        tempUser.password = await bcrypt.hash(newPassword, salt);
        await tempUser.save();
        return {
          status: 1,
          msg: "Updated Password",
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
