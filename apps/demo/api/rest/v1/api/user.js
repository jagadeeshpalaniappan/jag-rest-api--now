// API: REST-API

var router = require("express").Router();
const { check, validationResult } = require("express-validator");

const userService = require("../../../../modules/user/user.service");
const {
  parseStr,
  arrToMap,
} = require("../../../../modules/common/utils/all.utils");
const {
  GetUsersInput,
  CreateUserInput,
  UpdateUserInput,
} = require("./schema/user");

const SEARCH_TERMS = ["fuzzySearch", "role", "sex", "isActive"];

async function getUsers(req, res) {
  try {
    // VALIDATE:
    const { value: input, error } = await GetUsersInput.validate({
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
    const { data, before, after } = await userService.getUsers(options);

    // RESP:
    res.json({ data, meta: { before, after } });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUser({ id });

    // RESP:
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function createUser(req, res) {
  try {
    // VALIDATE:
    const { value: user, error } = await CreateUserInput.validate(req.body);
    if (error) res.status(400).json({ error });

    // TX:
    const createdUsers = await userService.createUsers({ users: [user] }); // bulkCreate

    // RESP:
    const output =
      createdUsers && createdUsers.length === 1
        ? createdUsers[0]
        : createdUsers;
    res.json(output);
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    // VALIDATE:
    const { value: user, error } = await UpdateUserInput.validate(req.body);
    if (error) res.status(400).json({ error });

    // TX:
    const updatedUser = await userService.updateUser({ id, user });

    // RESP:
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function deleteAllUser(req, res) {
  try {
    const deletedUsers = await userService.deleteAllUser();
    res.json({ users: deletedUsers });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const deletedUser = await userService.deleteUser({ id });
    res.json({ user: deletedUser });
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deleteAllUser,
};
