const commonResolvers = require("./common");
const userResolvers = require("./user");
const postResolvers = require("./post");
const todoResolvers = require("./todo");

const resolvers = {
  Query: {
    hello: () => "Hello Jag!!!!!",
    // ...commonResolvers.Query,
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...todoResolvers.Query,
  },
  Mutation: {
    ...commonResolvers.Mutation,
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...todoResolvers.Mutation,
  },
  User: userResolvers.User,
};

module.exports = { resolvers };
