const Joi = require("@hapi/joi");
const { PaginationOptions, FilterOptions } = require("./common");

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
  isActive: Joi.boolean(),
});

const FILTER_OPTIONS = ["title", "userId", "isActive"];
const SORT_OPTIONS = ["title", "viewCount", "updatedTs"];

const GetPostsInput = Joi.object({
  filters: FilterOptions(FILTER_OPTIONS),
  search: Joi.string(),
  sort: Joi.string().valid(...SORT_OPTIONS),
  ...PaginationOptions,
});

module.exports = {
  GetPostsInput,
  CreatePostInput,
  UpdatePostInput,
};
