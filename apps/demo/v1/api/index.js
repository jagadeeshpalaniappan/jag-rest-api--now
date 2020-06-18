var router = require("express").Router();
const { check, validationResult } = require("express-validator");

const userService = require("../modules/user/user.service");
const { arrToMap } = require("../modules/common/utils/all.utils");

const SEARCH_TERMS = ["fuzzySearch", "role", "sex", "isActive"];

const validateGetUsers = ({ filterMap }) => {
  const errors = [];

  // VALIDATE: FILTER:
  const validFilters = new Set(SEARCH_TERMS);
  const invalidFilters = Object.keys(filterMap).filter(
    (filter) => !validFilters.has(filter)
  );
  if (invalidFilters && invalidFilters.length > 0)
    errors.push(`Invalid filters: ${JSON.stringify(invalidFilters)}`);

  return errors;
};

const getUsersValidateMiddleware = [
  check("sort").isIn(["name", "username", "created"]),
  check("pageSize").toInt(),
];

// GET: /api/v1/users
router.get("/users", getUsersValidateMiddleware, async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { search, sort, pageSize, pageBefore, pageAfter, filters } =
      req.query || {};
    const page = {
      size: pageSize,
      before: pageBefore,
      after: pageAfter,
    };

    // console.log({ filters });

    const filterMap = filters ? arrToMap(JSON.parse(filters)) : {};
    filterMap.fuzzySearch = search;

    const postErrors = validateGetUsers({ filterMap });
    if (postErrors && postErrors.length > 0)
      res.status(400).json({ errors: postErrors });

    // VALIDATION: SUCCESS:
    const input = { search, sort, page, filterMap };
    const users = await userService.getUsers({ input });
    res.json({ users });
  } catch (err) {
    console.error(err);
    const { name, message, description } = err || {};
    res.status(500).json({ errors: [{ name, message, description }] });
  }
});

// GET: /api/v1/users/:id
router.get("/users/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUser({ id });
    res.json({ user });
  } catch (err) {
    const { name, message, description } = err || {};
    res.status(500).json({ error: { name, message, description } });
  }
});

// POST: /api/v1/users
router.post("/users", async function (req, res) {
  try {
    const user = req.body;
    const updatedUser = await userService.addUser({ user });
    res.json({ user: updatedUser });
  } catch (err) {
    const { name, message, description } = err || {};
    res.status(500);
    res.json({ error: { name, message, description } });
  }
});

// PUT: /api/v1/users/:id
router.put("/users/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const user = req.body;
    const updatedUser = await userService.updateUser({ id, user });
    res.json({ user: updatedUser });
  } catch (err) {
    const { name, message, description } = err || {};
    res.status(500);
    res.json({ error: { name, message, description } });
  }
});

// DELETE: /api/v1/users
router.delete("/users", async function (req, res) {
  try {
    const user = await userService.deleteAllUser();
    res.json({ user });
  } catch (err) {
    const { name, message, description } = err || {};
    res.status(500);
    res.json({ error: { name, message, description } });
  }
});

// DELETE: /api/v1/users/:id
router.delete("/users/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const user = await userService.deleteUser({ id });
    res.json({ user });
  } catch (err) {
    const { name, message, description } = err || {};
    res.status(500);
    res.json({ error: { name, message, description } });
  }
});

module.exports = router;
