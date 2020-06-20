const Joi = require("@hapi/joi");
const { PaginationOptions, FilterOptions } = require("./common");

const CreateUserInput = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  phone: Joi.string(),
  sex: Joi.string(),
  role: Joi.string(),
});

const UpdateUserInput = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  username: Joi.string().alphanum().min(3).max(30),
  phone: Joi.string(),
  sex: Joi.string(),
  role: Joi.string(),
  isActive: Joi.boolean(),
});

const FILTER_OPTIONS = ["sex", "role", "isActive"];
const SORT_OPTIONS = ["name", "username", "updatedTs"];

const GetUsersInput = Joi.object({
  filters: FilterOptions(FILTER_OPTIONS),
  search: Joi.string(),
  sort: Joi.string().valid(...SORT_OPTIONS),
  ...PaginationOptions,
});

module.exports = {
  GetUsersInput,
  CreateUserInput,
  UpdateUserInput,
};
