const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const sequelize = require("./util/database");
const { graphqlUploadExpress } = require("graphql-upload");

// const User = require("./model/user");

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const contextMiddleware = require("./util/contextMiddleware");

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: contextMiddleware,
    uploads: false,
  });

  await server.start();

  const app = express();

  app.use(
    graphqlUploadExpress({
      maxFileSize: 30000000,
      maxFiles: 20,
    })
  );

  sequelize
    .sync()
    .then((result) => {
      console.log("Synced");
    })
    .catch((err) => {
      console.log("Err");
    });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    server.applyMiddleware({ app });
    console.log("Success at " + PORT);
  });
};

startServer();
//http://localhost:4000/graphql
