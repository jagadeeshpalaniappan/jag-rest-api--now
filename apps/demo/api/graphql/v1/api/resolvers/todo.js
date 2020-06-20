// const xss = require("xss");  // TODO:
const todoService = require("../../../../../modules/todo/todo.service");
const userService = require("../../../../../modules/user/user.service");

async function todos(root, args, session) {
  const { options } = args || {};
  const { pagination, search, sort, filterBy } = options || {};

  console.log({ search, sort, pagination, filterBy });

  const filterTerms = search
    ? { fuzzySearch: search, ...filterBy }
    : { ...filterBy };

  console.log({ filterTerms });

  const { data, before, after } = await todoService.getTodos({
    search,
    sort,
    pagination,
    filterTerms,
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

async function user(root, args, session) {
  const post = root; // from: root we can get parentInfo
  console.log("###user:", { post });
  return userService.getUser({ id: post.userId });
}

const resolvers = {
  Query: { todos, todo },
  Mutation: {
    createTodo,
    updateTodo,
    deleteTodo,
  },
  Todo: {
    user,
  },
};

module.exports = resolvers;
