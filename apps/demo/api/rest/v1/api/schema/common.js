const Joi = require("@hapi/joi");

const PaginationOptions = {
  pageSize: Joi.number().integer(),
  pageBefore: Joi.string(),
  pageAfter: Joi.string(),
};

const FilterOption = (validKeys) =>
  Joi.object({
    key: validKeys ? Joi.string().valid(...validKeys) : Joi.string(),
    value: Joi.any(),
  });

const FilterOptions = (validFilterKeys) =>
  Joi.array().items(FilterOption(validFilterKeys));
module.exports = {
  PaginationOptions,
  FilterOptions,
};
