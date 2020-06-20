// API: REST-API

var router = require("express").Router();
const { check, validationResult } = require("express-validator");

const userService = require("../../../../modules/user/user.service");
const { strToObj } = require("../../../../modules/common/utils/all.utils");
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
      filterBy: strToObj(req.query.filterBy), // strToJSON
    });
    if (error) res.status(400).json({ error });

    // POPULATE:
    const { search, sort, pageSize, pageBefore, pageAfter, filterBy } = input;
    const pagination = { size: pageSize, before: pageBefore, after: pageAfter };
    const filterMap = { ...filterBy, fuzzySearch: search };

    // TX:
    const { data, before, after } = await userService.getUsers({
      sort,
      pagination,
      filterMap,
    });

    // RESP:
    res.json({ data, meta: { before, after } });
  } catch (err) {
    console.error(err);
    const { name, message, description } = err || {};
    res.status(500).json({ errors: [{ name, message, description }] });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUser({ id });

    // RESP:
    res.json({ user });
  } catch (err) {
    const { name, message, description } = err || {};
    res.status(500).json({ error: { name, message, description } });
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
  } catch (err) {
    res.status(500).json({ error: err });
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
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

async function deleteAllUser(req, res) {
  try {
    const user = await userService.deleteAllUser();
    res.json({ user });
  } catch (err) {
    const { name, message, description } = err || {};
    res.status(500);
    res.json({ error: { name, message, description } });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.deleteUser({ id });
    res.json({ user });
  } catch (err) {
    const { name, message, description } = err || {};
    res.status(500);
    res.json({ error: { name, message, description } });
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
