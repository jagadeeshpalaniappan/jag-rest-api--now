const xss = require("xss");
const userService = require("../../../../../modules/user/user.service");
const { arrToMap } = require("../../../../../modules/common/utils/all.utils");
// const postDao = require("../post/userService");
// const todoDao = require("../todo/userService");
// const { validateFields } = require("../../utils/common");

/*
function users(root, args, session) {
  return userService.getUsers();
}
*/

async function users(root, args, session) {
  const { options } = args || {};
  const { pagination, search, sort, filters } = options || {};

  console.log({ search, sort, pagination, filters });

  const filterMap = filters ? arrToMap(filters) : {};
  filterMap.fuzzySearch = search;

  console.log({ filterMap });

  const { data, before, after } = await userService.getUsers({
    search,
    sort,
    page: pagination,
    filterMap,
  });

  console.log({ users });
  return { data, meta: { before, after } }; //{ data: [1, 2], meta: [] };
}

function user(root, args, session) {
  const { id } = args;
  return userService.getUser({ id });
}

function createUser(root, args, session) {
  console.log("createUser:", args);
  // const { name, email } = args.input;
  // const user = { name: xss(name), email: xss(email) };
  // let required = ["name", "email"];
  // validateFields(user, required);

  const user = args.input;
  return userService.createUser({ user });
}

function updateUser(root, args, session) {
  console.log("updateUser:", args);
  const { id } = args;
  // const { name, email } = args.input;
  // const user = {};
  // if (name) user.name = xss(name);
  // if (email) user.email = xss(email);
  // let required = ["name", "email"];
  // validateFields(user, required);

  const user = args.input;
  return userService.updateUser({ id, user });
}

async function deleteUser(root, args, session) {
  const { id } = args;
  // validateFields({ id }, ["id"]);
  const deletedUser = await userService.deleteUser({ id });
  return !!deletedUser;
}

// function posts(root, args, session) {
//   const user = root; // from: root we can parentInfo
//   return postDao.getPostsByUserId({ userId: user.id });
// }

// function todos(root, args, session) {
//   const user = root; // from: root we can parentInfo
//   return todoDao.getTodosByUserId({ userId: user.id });
// }

const resolvers = {
  Query: { users, user },
  Mutation: {
    createUser,
    updateUser,
    deleteUser,
  },
  // User: {
  //   posts,
  //   todos,
  // },
};

module.exports = resolvers;
