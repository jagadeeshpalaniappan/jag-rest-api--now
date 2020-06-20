const Joi = require("@hapi/joi");
const { PaginationOptions } = require("./common");

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

const TodoFilterOptions = Joi.object({
  title: Joi.string(),
  userId: Joi.string(),
  isActive: Joi.boolean(),
});

const GetTodosInput = Joi.object({
  filterBy: TodoFilterOptions,
  search: Joi.string(),
  sort: Joi.string().valid("title", "viewCount", "updatedTs"),
  ...PaginationOptions,
});

module.exports = {
  GetTodosInput,
  CreateTodoInput,
  UpdateTodoInput,
};
