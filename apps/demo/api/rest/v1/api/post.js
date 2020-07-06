// API: REST-API

var router = require("express").Router();
const { check, validationResult } = require("express-validator");

const postService = require("../../../../modules/post/post.service");
const {
  parseStr,
  arrToMap,
} = require("../../../../modules/common/utils/all.utils");
const {
  GetPostsInput,
  CreatePostInput,
  UpdatePostInput,
} = require("./schema/post");

const SEARCH_TERMS = ["fuzzySearch", "title", "sex", "isActive"];

async function getPosts(req, res) {
  try {
    // VALIDATE:
    const { value: input, error } = await GetPostsInput.validate({
      ...req.query,
      filters: parseStr(req.query.filters) || [],
    });
    if (error) res.status(400).json({ error });

    // POPULATE:
    const { search, sort, pageSize, pageBefore, pageAfter, filters } = input;
    const filterBy = arrToMap(filters);
    const pagination = { size: pageSize, before: pageBefore, after: pageAfter };
    const filterTerms = { ...filterBy, fuzzySearch: search };

    // TX:
    const options = { sort, pagination, filterTerms };
    const { data, before, after } = await postService.getPosts(options);

    // RESP:
    res.json({ data, meta: { before, after } });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getPost(req, res) {
  try {
    const { id } = req.params;
    const post = await postService.getPost({ id });

    // RESP:
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function createPost(req, res) {
  try {
    // VALIDATE:
    const { value: post, error } = await CreatePostInput.validate(req.body);
    if (error) res.status(400).json({ error });

    // POPULATE:
    const newPost = { ...post, isActive: true };

    // TX:
    const createdPosts = await postService.createPosts({
      posts: [newPost],
    }); // bulkCreate

    // RESP:
    const output =
      createdPosts && createdPosts.length === 1
        ? { post: createdPosts[0] }
        : { posts: createdPosts };
    res.json(output);
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function updatePost(req, res) {
  try {
    const { id } = req.params;
    // VALIDATE:
    const { value: post, error } = await UpdatePostInput.validate(req.body);
    if (error) res.status(400).json({ error });

    // TX:
    const updatedPost = await postService.updatePost({ id, post });

    // RESP:
    res.json({ post: updatedPost });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function deleteAllPost(req, res) {
  try {
    const deletedPosts = await postService.deleteAllPost();
    res.json({ posts: deletedPosts });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const deletedPost = await postService.deletePost({ id });
    res.json({ post: deletedPost });
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  deleteAllPost,
};
