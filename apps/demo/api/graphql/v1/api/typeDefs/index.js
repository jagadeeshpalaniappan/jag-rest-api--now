let { gql } = require("apollo-server-express");

// common:
const commonTypeDefs = require("./common");
// const commonResolvers = require("./common/resolvers");

// user:
const userTypeDefs = require("./user");
// const userResolvers = require("./user/resolvers");

// // post:
// const postTypeDefs = require("./post/typeDefs");
// const postResolvers = require("./post/resolvers");

// // todo:
// const todoTypeDefs = require("./todo/typeDefs");
// const todoResolvers = require("./todo/resolvers");

const baseTypeDefs = gql`
  type Query {
    hello: String
  }
  type Mutation {
    _: Int
  }
`;
const typeDefs = [
  baseTypeDefs,
  commonTypeDefs,
  userTypeDefs,
  // postTypeDefs,
  // todoTypeDefs,
];

// const resolvers = {
//   Query: {
//     hello: () => "Hello Jag!!!!!",
//     // ...commonResolvers.Query,
//     ...userResolvers.Query,
//   },
//   Mutation: {
//     // ...commonResolvers.Mutation,
//     // ...userResolvers.Mutation,
//   },
//   // User: userResolvers.User,
// };

module.exports = { typeDefs };
