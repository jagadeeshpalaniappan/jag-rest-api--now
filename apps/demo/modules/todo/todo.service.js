const todoDao = require("./todo.dao");

const getTodos = (...args) => {
  return todoDao.getTodos(...args);
};

const getTodo = (...args) => {
  return todoDao.getTodo(...args);
};

const createTodo = (...args) => {
  return todoDao.createTodo(...args);
};

const createTodos = (...args) => {
  return todoDao.createTodos(...args);
};

const updateTodo = (...args) => {
  return todoDao.updateTodo(...args);
};

const deleteTodo = (...args) => {
  return todoDao.deleteTodo(...args);
};

const deleteAllTodo = ({ collection }) => {
  return todoDao.deleteAllTodo({ collection });
};

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  createTodos,
  updateTodo,
  deleteTodo,
  deleteAllTodo,
};
