const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Post {
    id: ID
    title: String
    body: String
    viewCount: Int
    isActive: Boolean
    userId: String
    user: User
  }

  input CreatePostInput {
    title: String!
    body: String!
    userId: String
  }

  input UpdatePostInput {
    title: String
    body: String
    viewCount: Int
    isActive: Boolean
    userId: String
  }

  type PostsPage {
    data: [Post]
    meta: PageMetadata
  }

  input PostFilterOptions {
    title: String
    isActive: Boolean
    userId: String
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
