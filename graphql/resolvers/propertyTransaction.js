const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const AWS = require("aws-sdk");
// const { GraphQLUpload } = require("graphql-upload");

const PropertyTransaction = require("../../model/propertyTransaction");
const User = require("../../model/user");

const s3 = new AWS.S3({
  accessKeyId: "abc",
  secretAccessKey: "def",
});

module.exports = {
  // Upload: GraphQLUpload,
  Query: {
    getAllPropertyTransaction: async (parent, args, context, info) => {
      try {
        const { user } = context;
        const emailId = user ? user.emailId : "";
        const tempUser = await User.findOne({ where: { emailId } });
        if (!tempUser) {
          throw new AuthenticationError("Unauthenticated");
        }
        const propertyTransaction = await PropertyTransaction.findAll({});
        return propertyTransaction;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    addPropertyTransaction: async (parent, args, context, info) => {
      try {
        const { name, price, country, status, file } = args;

        const { user } = context;

        const emailId = user ? user.emailId : "";
        const tempUser = await User.findOne({ where: { emailId } });
        if (!tempUser) {
          throw new AuthenticationError("Unauthenticated");
        }
        const { createReadStream, filename } = await file;
        let stream = createReadStream();
        let imageUrl;
        const params = {
          Bucket: "arretailpoc",
          Key: filename,
          Body: stream,
        };
        const stored = await s3.upload(params).promise();
        imageUrl = stored.Location.toString();

        if (name.trim() === "") {
          throw new UserInputError("Name must not be empty");
        }

        if (price.trim() === "") {
          throw new UserInputError("Price must not be empty");
        }

        if (country.trim() === "") {
          throw new UserInputError("Country must not be empty");
        }

        if (status.trim() === "") {
          throw new UserInputError("Status cannot be empty");
        }
        if (imageUrl.trim() === "") {
          throw new UserInputError("Image cannot be empty");
        }

        const propertyTransaction = await PropertyTransaction.create({
          name,
          price,
          country,
          status,
          imageUrl,
        });

        return propertyTransaction;
      } catch (err) {
        throw err;
      }
    },
  },
};
