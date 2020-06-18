const data = require("@begin/data");
const xss = require("xss");
const dao = require("./dao");
const userDao = require("../user/dao");
const { validateFields } = require("../../utils/common");

async function posts(root, args, session) {
  const { options } = args;
  const { pagination } = options;

  const { data, cursor } = await dao.getLimitedPosts({
    limit: pagination.limit,
    cursor: pagination.cursor,
  });

  const totalCount = await dao.getPostsTotalCount();
  const meta = { totalCount, cursor };

  // return: PostsPage
  return { data, meta };
}

function post(root, args, session) {
  const { id } = args;
  return dao.getPost({ id });
}

function createPost(root, args, session) {
  // console.log("createPost:", args);
  const { title, body, userId } = args.input;
  const post = { title: xss(title), body: xss(body), userId };
  let required = ["title", "userId"];
  validateFields(post, required);

  return dao.createPost({ post });
}

function updatePost(root, args, session) {
  const { id } = args;
  const { title, body, userId } = args.input;
  const post = {};
  if (title) post.title = xss(title);
  if (body) post.body = xss(body);
  if (userId) post.userId = userId;
  let required = ["title"];
  validateFields(post, required);
  return dao.updatePost({ id, post });
}

async function deletePost(root, args, session) {
  const { id } = args;
  validateFields({ id }, ["id"]);
  const deletedPost = await dao.deletePost({ id });
  return !!deletedPost;
}

function user(root, args, session) {
  const post = root; // from: root we can parentInfo
  return userDao.getUser({ id: post.userId });
}

const resolvers = {
  Query: { posts, post },
  Mutation: {
    createPost,
    updatePost,
    deletePost,
  },
  Post: {
    user,
  },
};

module.exports = resolvers;
