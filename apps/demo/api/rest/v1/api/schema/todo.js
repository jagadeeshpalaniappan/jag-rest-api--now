const Joi = require("@hapi/joi");
const { PaginationOptions, FilterOptions } = require("./common");

const CreateTodoInput = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  description: Joi.string(),
  userId: Joi.string().required(),
});

const UpdateTodoInput = Joi.object({
  title: Joi.string().min(3).max(30),
  description: Joi.string(),
  userId: Joi.string().required(),
});

const FILTER_OPTIONS = ["title", "userId", "isActive"];
const SORT_OPTIONS = ["title", "viewCount", "updatedTs"];

const GetTodosInput = Joi.object({
  filters: FilterOptions(FILTER_OPTIONS),
  search: Joi.string(),
  sort: Joi.string().valid(...SORT_OPTIONS),
  ...PaginationOptions,
});

module.exports = {
  GetTodosInput,
  CreateTodoInput,
  UpdateTodoInput,
};
