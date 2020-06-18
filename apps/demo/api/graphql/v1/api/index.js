// API: GRAPHQL-API

var router = require("express").Router();
const { ApolloServer } = require("apollo-server-express");
const { resolvers } = require("./resolvers");
const { typeDefs } = require("./typeDefs");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Remember: This will enable 'playground' in PROD
  playground: true,
});
server.applyMiddleware({ app: router, path: "/" });

module.exports = router;
