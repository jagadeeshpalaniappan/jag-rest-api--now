// API: GRAPHQL-API

var router = require("express").Router();
const { ApolloServer, gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello Jag!",
  },
};
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app: router, path: "/" });

module.exports = router;
