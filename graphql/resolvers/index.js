const userResolvers = require("./user");
const propertyTransactionResolvers = require("./propertyTransaction");
const profileResolvers = require("./profile");
const bankDetailsResolvers = require("./bankDetails");
const investmentsResolvers = require("./investment");
const { GraphQLUpload } = require("graphql-upload");

module.exports = {
  Upload: GraphQLUpload,
  Query: {
    ...userResolvers.Query,
    ...propertyTransactionResolvers.Query,
    ...profileResolvers.Query,
    ...bankDetailsResolvers.Query,
    ...investmentsResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...propertyTransactionResolvers.Mutation,
    // ...profileResolvers.Mutation,
    ...bankDetailsResolvers.Mutation,
    ...investmentsResolvers.Mutation,
  },
};
