const Joi = require("@hapi/joi");

const PaginationOptions = {
  pageSize: Joi.number().integer(),
  pageBefore: Joi.string(),
  pageAfter: Joi.string(),
};

module.exports = {
  PaginationOptions,
};
