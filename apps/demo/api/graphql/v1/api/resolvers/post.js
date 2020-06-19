// const xss = require("xss");  // TODO:
const postService = require("../../../../../modules/post/post.service");
const { arrToMap } = require("../../../../../modules/common/utils/all.utils");
// const postDao = require("../post/postService");
// const todoDao = require("../todo/postService");
// const { validateFields } = require("../../utils/common");

/*
function posts(root, args, session) {
  return postService.getPosts();
}
*/

async function posts(root, args, session) {
  const { options } = args || {};
  const { pagination, search, sort, filterBy } = options || {};

  console.log({ search, sort, pagination, filterBy });

  const filterMap = search
    ? { fuzzySearch: search, ...filterBy }
    : { ...filterBy };

  console.log({ filterMap });

  const { data, before, after } = await postService.getPosts({
    search,
    sort,
    pagination,
    filterMap,
  });

  console.log({ posts });
  return { data, meta: { before, after } }; //{ data: [1, 2], meta: [] };
}

function post(root, args, session) {
  const { id } = args;
  return postService.getPost({ id });
}

function createPost(root, args, session) {
  console.log("createPost:", args);
  const post = args.input;
  return postService.createPost({ post });
}

function updatePost(root, args, session) {
  console.log("updatePost:", args);
  const { id } = args;
  const post = args.input;
  return postService.updatePost({ id, post });
}

async function deletePost(root, args, session) {
  const { id } = args;
  const deletedPost = await postService.deletePost({ id });
  return !!deletedPost;
}

// function posts(root, args, session) {
//   const post = root; // from: root we can parentInfo
//   return postDao.getPostsByPostId({ postId: post.id });
// }

// function todos(root, args, session) {
//   const post = root; // from: root we can parentInfo
//   return todoDao.getTodosByPostId({ postId: post.id });
// }

const resolvers = {
  Query: { posts, post },
  Mutation: {
    createPost,
    updatePost,
    deletePost,
  },
  // Post: {
  //   posts,
  //   todos,
  // },
};

module.exports = resolvers;
