const commonResolvers = require("./common");
const userResolvers = require("./user");

const resolvers = {
  Query: {
    hello: () => "Hello Jag!!!!!",
    // ...commonResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...commonResolvers.Mutation,
    ...userResolvers.Mutation,
  },
  // User: userResolvers.User,
};

module.exports = { resolvers };
