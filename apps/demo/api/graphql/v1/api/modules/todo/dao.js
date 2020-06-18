const db = require("@begin/data");
const { convertKeyToId } = require("../../utils/common");

/*
async function getTodos() {
  const todos = await db.get({ table: "todos" });
  return convertKeyToId(todos);
}
*/

function getTodosTotalCount() {
  return db.count({ table: "todos" });
}

async function getLimitedTodos({ limit, cursor }) {
  const todos = await db.get({ table: "todos", limit, cursor });
  const data = convertKeyToId(todos);
  return { data, cursor: todos["cursor"] };
}

async function getTodo({ id }) {
  const todo = await db.get({ table: "todos", key: id });
  return convertKeyToId([todo])[0];
}

async function createTodo({ todo }) {
  const dbTodo = await db.set({ table: "todos", ...todo });
  return convertKeyToId([dbTodo])[0];
}

async function updateTodo({ id, todo }) {
  const curTodo = await db.get({ table: "todos", key: id });
  const newTodo = { ...curTodo, ...todo };
  const dbTodo = await db.set({ table: "todos", key: id, ...newTodo });
  return convertKeyToId([dbTodo])[0];
}

function deleteTodo({ id }) {
  return db.destroy({ table: "todos", key: id });
}

async function getTodosByUserId({ userId }) {
  const allTodos = await db.get({ table: "todos" });
  const todos = allTodos.filter((todo) => todo.userId === userId);
  return convertKeyToId(todos);
}

module.exports = {
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosByUserId,
  getLimitedTodos,
  getTodosTotalCount,
};
