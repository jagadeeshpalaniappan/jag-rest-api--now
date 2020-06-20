const Joi = require("@hapi/joi");
const { PaginationOptions } = require("./common");

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

const UserFilterOptions = Joi.object({
  sex: Joi.string(),
  role: Joi.string(),
  isActive: Joi.boolean(),
});

const GetUsersInput = Joi.object({
  filterBy: UserFilterOptions,
  search: Joi.string(),
  sort: Joi.string().valid("name", "username", "updatedTs"),
  ...PaginationOptions,
});

module.exports = {
  GetUsersInput,
  CreateUserInput,
  UpdateUserInput,
};
