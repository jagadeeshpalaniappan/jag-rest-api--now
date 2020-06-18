let { gql } = require("apollo-server-express");

// common:
const commonResolvers = require("./common");

// user:
const userResolvers = require("./user");

const resolvers = {
  Query: {
    hello: () => "Hello Jag!!!!!",
    // ...commonResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    // ...commonResolvers.Mutation,
    // ...userResolvers.Mutation,
  },
  // User: userResolvers.User,
};

module.exports = { resolvers };
