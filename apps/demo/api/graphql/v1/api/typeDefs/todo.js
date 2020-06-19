const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Todo {
    id: ID
    name: String
    email: String
    todoname: String
    phone: String
    sex: String
    role: String
    isActive: Boolean
    # todos: [Todo]
    # todos: [Todo]
    # todos(options: TodosPageQueryOptions): TodosPage # TODO: facing problem in filtering and applying criteria
    # todos(options: TodosPageQueryOptions): TodosPage
  }

  input CreateTodoInput {
    name: String!
    email: String!
    todoname: String!
    phone: String
    sex: String
    role: String
    isActive: Boolean
  }

  input UpdateTodoInput {
    name: String
    email: String
    todoname: String
    phone: String
    sex: String
    role: String
    isActive: Boolean
  }

  type TodosPage {
    data: [Todo]
    meta: PageMetadata
  }

  input TodoFilterOptions {
    sex: String
    role: String
    isActive: Boolean
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
