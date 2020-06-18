const xss = require("xss");
const userService = require("../../../../../../modules/user/user.service");
// const postDao = require("../post/userService");
// const todoDao = require("../todo/userService");
// const { validateFields } = require("../../utils/common");

/*
function users(root, args, session) {
  return userService.getUsers();
}
*/

async function users(root, args, session) {
  const { options } = args;
  const { pagination } = options;

  // const { data, cursor } = await userService.getLimitedUsers({
  //   limit: pagination.limit,
  //   cursor: pagination.cursor,
  // });

  // const totalCount = await userService.getUsersTotalCount();
  // const meta = { totalCount, cursor };

  const data = {},
    meta = {};

  // return: UsersPage
  return { data, meta };
}

function user(root, args, session) {
  const { id } = args;
  return userService.getUser({ id });
}

function createUser(root, args, session) {
  // console.log("createUser:", args);
  const { name, email } = args.input;
  const user = { name: xss(name), email: xss(email) };
  let required = ["name", "email"];
  // validateFields(user, required);

  return userService.createUser({ user });
}

function updateUser(root, args, session) {
  const { id } = args;
  const { name, email } = args.input;
  const user = {};
  if (name) user.name = xss(name);
  if (email) user.email = xss(email);
  let required = ["name", "email"];
  // validateFields(user, required);
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
