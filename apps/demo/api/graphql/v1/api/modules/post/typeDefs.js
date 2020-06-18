const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Post {
    id: ID
    title: String
    body: String
    user: User
  }

  input CreatePostInput {
    title: String!
    body: String!
    userId: String!
  }

  input UpdatePostInput {
    title: String
    body: String
    userId: String!
  }

  type PostsPage {
    data: [Post]
    meta: PageMetadata
  }

  input PostsPageQueryOptions {
    pagination: PaginationOptions
    # search: SearchOptions # TODO: implement search
  }

  extend type Query {
    # posts: [Post] # **deprecated** (use with pagination)
    posts(options: PostsPageQueryOptions): PostsPage
    post(id: ID!): Post
  }
  extend type Mutation {
    createPost(input: CreatePostInput!): Post
    updatePost(id: ID!, input: UpdatePostInput!): Post
    deletePost(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
