const userDao = require("./user.dao");

const getUsers = (...args) => {
  return userDao.getUsers(...args);
};

const getUser = (...args) => {
  return userDao.getUser(...args);
};

const addUser = (...args) => {
  return userDao.addUser(...args);
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
  addUser,
  updateUser,
  deleteUser,
  deleteAllUser,
};
