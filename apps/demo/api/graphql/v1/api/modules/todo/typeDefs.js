const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Todo {
    id: ID
    title: String
    completed: Boolean
    user: User
  }

  input CreateTodoInput {
    title: String!
    completed: Boolean
    userId: String!
  }

  input UpdateTodoInput {
    title: String
    completed: Boolean
    userId: String
  }

  type TodosPage {
    data: [Todo]
    meta: PageMetadata
  }

  input TodosPageQueryOptions {
    pagination: PaginationOptions
    # search: SearchOptions # TODO: implement search
  }

  extend type Query {
    # todos: [Todo] # **deprecated** (use with pagination)
    todos(options: TodosPageQueryOptions): TodosPage
    todo(id: ID!): Todo
  }
  extend type Mutation {
    createTodo(input: CreateTodoInput!): Todo
    updateTodo(id: ID!, input: UpdateTodoInput!): Todo
    deleteTodo(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
