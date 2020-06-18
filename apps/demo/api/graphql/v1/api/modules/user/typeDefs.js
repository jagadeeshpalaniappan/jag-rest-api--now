const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID
    name: String
    email: String
    # posts: [Post]
    # todos: [Todo]
    # posts(options: PostsPageQueryOptions): PostsPage # TODO: facing problem in filtering and applying criteria
    # todos(options: TodosPageQueryOptions): TodosPage
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String!
    email: String!
  }

  type UsersPage {
    data: [User]
    meta: PageMetadata
  }

  input UsersPageQueryOptions {
    pagination: PaginationOptions
    # search: SearchOptions # TODO: implement search
  }

  extend type Query {
    # users: [User] # **deprecated** (use with pagination)
    users(options: UsersPageQueryOptions): UsersPage
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
