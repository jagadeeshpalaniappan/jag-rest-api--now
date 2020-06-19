const postDao = require("./post.dao");

const getPosts = (...args) => {
  return postDao.getPosts(...args);
};

const getPost = (...args) => {
  return postDao.getPost(...args);
};

const createPost = (...args) => {
  return postDao.createPost(...args);
};

const createPosts = (...args) => {
  return postDao.createPosts(...args);
};

const updatePost = (...args) => {
  return postDao.updatePost(...args);
};

const deletePost = (...args) => {
  return postDao.deletePost(...args);
};

const deleteAllPost = ({ collection }) => {
  return postDao.deleteAllPost({ collection });
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  createPosts,
  updatePost,
  deletePost,
  deleteAllPost,
};
