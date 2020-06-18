const db = require("@begin/data");
const { convertKeyToId } = require("../../utils/common");

/*
async function getUsers() {
  const users = await db.get({ table: "users" });
  return convertKeyToId(users);
}
*/

async function getLimitedUsers({ limit, cursor }) {
  const users = await db.get({ table: "users", limit, cursor });
  const data = convertKeyToId(users);
  return { data, cursor: users["cursor"] };
}

function getUsersTotalCount() {
  return db.count({ table: "users" });
}

async function getUser({ id }) {
  const user = await db.get({ table: "users", key: id });
  return convertKeyToId([user])[0];
}

async function createUser({ user }) {
  const dbUser = await db.set({ table: "users", ...user });
  return convertKeyToId([dbUser])[0];
}

async function updateUser({ id, user }) {
  const curUser = await db.get({ table: "users", key: id });
  const newUser = { ...curUser, ...user };
  const dbUser = await db.set({ table: "users", key: id, ...newUser });
  return convertKeyToId([dbUser])[0];
}

function deleteUser({ id }) {
  return db.destroy({ table: "users", key: id });
}

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getLimitedUsers,
  getUsersTotalCount,
};
