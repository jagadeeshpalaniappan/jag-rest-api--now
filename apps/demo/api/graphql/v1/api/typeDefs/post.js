const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Post {
    id: ID
    name: String
    email: String
    postname: String
    phone: String
    sex: String
    role: String
    isActive: Boolean
    # posts: [Post]
    # todos: [Todo]
    # posts(options: PostsPageQueryOptions): PostsPage # TODO: facing problem in filtering and applying criteria
    # todos(options: TodosPageQueryOptions): TodosPage
  }

  input CreatePostInput {
    name: String!
    email: String!
    postname: String!
    phone: String
    sex: String
    role: String
    isActive: Boolean
  }

  input UpdatePostInput {
    name: String
    email: String
    postname: String
    phone: String
    sex: String
    role: String
    isActive: Boolean
  }

  type PostsPage {
    data: [Post]
    meta: PageMetadata
  }

  input PostFilterOptions {
    sex: String
    role: String
    isActive: Boolean
  }

  input PostsQueryOptions {
    pagination: PaginationOptions
    search: String
    sort: String
    filterBy: PostFilterOptions
  }

  extend type Query {
    # posts: [Post] # **deprecated** (use with pagination)
    posts(options: PostsQueryOptions): PostsPage
    post(id: ID!): Post
  }

  extend type Mutation {
    createPost(input: CreatePostInput!): Post
    updatePost(id: ID!, input: UpdatePostInput!): Post
    deletePost(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
