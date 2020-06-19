const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Post {
    id: ID
    title: String
    body: String
    viewCount: Int
    userId: String
    isActive: Boolean
    # posts: [Post]
    # todos: [Todo]
    # posts(options: PostsPageQueryOptions): PostsPage # TODO: facing problem in filtering and applying criteria
    # todos(options: TodosPageQueryOptions): TodosPage
  }

  input CreatePostInput {
    title: String!
    body: String!
    userId: String
    isActive: Boolean
  }

  input UpdatePostInput {
    title: String
    body: String
    viewCount: Int
    userId: String
    isActive: Boolean
  }

  type PostsPage {
    data: [Post]
    meta: PageMetadata
  }

  input PostFilterOptions {
    title: String
    userId: String
    isActive: Boolean
  }

  input PostsQueryOptions {
    pagination: PaginationOptions
    search: String
    sort: String
    filterBy: PostFilterOptions
  }

  extend type Query {
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
