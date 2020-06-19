// const xss = require("xss");  // TODO:
const todoService = require("../../../../../modules/todo/todo.service");
const { arrToMap } = require("../../../../../modules/common/utils/all.utils");
// const todoDao = require("../todo/todoService");
// const todoDao = require("../todo/todoService");
// const { validateFields } = require("../../utils/common");

/*
function todos(root, args, session) {
  return todoService.getTodos();
}
*/

async function todos(root, args, session) {
  const { options } = args || {};
  const { pagination, search, sort, filterBy } = options || {};

  console.log({ search, sort, pagination, filterBy });

  const filterMap = search
    ? { fuzzySearch: search, ...filterBy }
    : { ...filterBy };

  console.log({ filterMap });

  const { data, before, after } = await todoService.getTodos({
    search,
    sort,
    pagination,
    filterMap,
  });

  console.log({ todos });
  return { data, meta: { before, after } }; //{ data: [1, 2], meta: [] };
}

function todo(root, args, session) {
  const { id } = args;
  return todoService.getTodo({ id });
}

function createTodo(root, args, session) {
  console.log("createTodo:", args);
  const input = args.input;
  const todo = { ...input, isActive: true };
  return todoService.createTodo({ todo });
}

function updateTodo(root, args, session) {
  console.log("updateTodo:", args);
  const { id } = args;
  const todo = args.input;
  return todoService.updateTodo({ id, todo });
}

async function deleteTodo(root, args, session) {
  const { id } = args;
  const deletedTodo = await todoService.deleteTodo({ id });
  return !!deletedTodo;
}

// function todos(root, args, session) {
//   const todo = root; // from: root we can parentInfo
//   return todoDao.getTodosByTodoId({ todoId: todo.id });
// }

// function todos(root, args, session) {
//   const todo = root; // from: root we can parentInfo
//   return todoDao.getTodosByTodoId({ todoId: todo.id });
// }

const resolvers = {
  Query: { todos, todo },
  Mutation: {
    createTodo,
    updateTodo,
    deleteTodo,
  },
  // Todo: {
  //   todos,
  //   todos,
  // },
};

module.exports = resolvers;
