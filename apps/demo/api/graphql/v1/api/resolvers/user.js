// const xss = require("xss");  // TODO:
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
  const { pagination, search, sort, filterBy } = options || {};

  console.log({ search, sort, pagination, filterBy });

  const filterMap = search
    ? { fuzzySearch: search, ...filterBy }
    : { ...filterBy };

  console.log({ filterMap });

  const { data, before, after } = await userService.getUsers({
    search,
    sort,
    pagination,
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
  const user = args.input;
  return userService.createUser({ user });
}

function updateUser(root, args, session) {
  console.log("updateUser:", args);
  const { id } = args;
  const user = args.input;
  return userService.updateUser({ id, user });
}

async function deleteUser(root, args, session) {
  const { id } = args;
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
