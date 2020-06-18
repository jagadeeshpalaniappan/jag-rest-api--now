// API: GRAPHQL-API

var router = require("express").Router();
const { ApolloServer, gql } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./modules");

// // Construct a schema, using GraphQL schema language
// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `;

// // Provide resolver functions for your schema fields
// const resolvers = {
//   Query: {
//     hello: () => "Hello Jag!",
//   },
// };
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Remember: This will enable 'playground' in PROD
  playground: true,
});
server.applyMiddleware({ app: router, path: "/" });

module.exports = router;
