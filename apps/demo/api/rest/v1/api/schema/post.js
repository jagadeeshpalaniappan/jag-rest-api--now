const Joi = require("@hapi/joi");
const { PaginationOptions } = require("./common");

const CreatePostInput = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  body: Joi.string(),
  viewCount: Joi.string(),
  userId: Joi.string().required(),
});

const UpdatePostInput = Joi.object({
  title: Joi.string().min(3).max(30),
  body: Joi.string(),
  viewCount: Joi.string(),
  userId: Joi.string().required(),
});

const PostFilterOptions = Joi.object({
  title: Joi.string(),
  userId: Joi.string(),
  isActive: Joi.boolean(),
});

const GetPostsInput = Joi.object({
  filterBy: PostFilterOptions,
  search: Joi.string(),
  sort: Joi.string().valid("title", "viewCount", "updatedTs"),
  ...PaginationOptions,
});

module.exports = {
  GetPostsInput,
  CreatePostInput,
  UpdatePostInput,
};
