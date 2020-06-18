const userDao = require("./user.dao");

const getUsers = (...args) => {
  return userDao.getUsers(...args);
};

const getUser = (...args) => {
  return userDao.getUser(...args);
};

const createUser = (...args) => {
  return userDao.createUser(...args);
};

const createUsers = (...args) => {
  return userDao.createUsers(...args);
};

const updateUser = (...args) => {
  return userDao.updateUser(...args);
};

const deleteUser = (...args) => {
  return userDao.deleteUser(...args);
};

const deleteAllUser = ({ collection }) => {
  return userDao.deleteAllUser({ collection });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  createUsers,
  updateUser,
  deleteUser,
  deleteAllUser,
};
