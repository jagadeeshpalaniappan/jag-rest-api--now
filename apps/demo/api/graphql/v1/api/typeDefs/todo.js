const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Todo {
    id: ID
    title: String
    description: String
    isActive: Boolean
    userId: String
    # todos: [Todo]
    # todos: [Todo]
    # todos(options: TodosPageQueryOptions): TodosPage # TODO: facing problem in filtering and applying criteria
    # todos(options: TodosPageQueryOptions): TodosPage
  }

  input CreateTodoInput {
    title: String!
    description: String
    userId: String
  }

  input UpdateTodoInput {
    title: String
    description: String
    isActive: Boolean
    userId: String
  }

  type TodosPage {
    data: [Todo]
    meta: PageMetadata
  }

  input TodoFilterOptions {
    title: String
    isActive: Boolean
    userId: String
  }

  input TodosQueryOptions {
    pagination: PaginationOptions
    search: String
    sort: String
    filterBy: TodoFilterOptions
  }

  extend type Query {
    # todos: [Todo] # **deprecated** (use with pagination)
    todos(options: TodosQueryOptions): TodosPage
    todo(id: ID!): Todo
  }

  extend type Mutation {
    createTodo(input: CreateTodoInput!): Todo
    updateTodo(id: ID!, input: UpdateTodoInput!): Todo
    deleteTodo(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
