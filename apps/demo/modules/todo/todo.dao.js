const faunadb = require("faunadb");
const q = faunadb.query;
const { getDbConnection } = require("../common/db");
const db = getDbConnection();
const {
  getId,
  getPageConfig,
  getCursors,
} = require("../common/utils/db.utils");

const COLLECTION_NAME = "todos";
const SEARCH_TERMS = ["fuzzySearch", "title", "userId", "isActive"];
const INDEX_CONFIG = {
  defaultIndex: "todos_idx_advsearch",
  sortIndex: {
    updatedTs: "todos_idx_advsearch_sortby@updatedTs",
    title: "todos_idx_advsearch_sortby@title",
  },
};

const getIndexName = (sort) => {
  return sort ? INDEX_CONFIG.sortIndex[sort] : INDEX_CONFIG.defaultIndex;
};

const getSearchValues = (filterMap) => {
  return SEARCH_TERMS.map((terms) => (filterMap && filterMap[terms]) || "*");
};

const getTodosAdvFql = ({ sort, pagination, filterMap }) => {
  const pageConfig = getPageConfig(pagination);
  const index = getIndexName(sort);

  // SEARCH_VAL_ARR:
  const searchVals = getSearchValues(filterMap);

  // READY-TO_QUERY:
  console.log({ index, pageConfig, sort, searchVals });

  // QUERY:
  const PageQuery = q.Paginate(q.Match(q.Index(index), searchVals), pageConfig);
  const PageResultsMapFn = sort
    ? q.Lambda(["x", "ref"], q.Get(q.Var("ref")))
    : q.Lambda(["ref"], q.Get(q.Var("ref")));
  const fql = q.Map(PageQuery, PageResultsMapFn);
  return fql;
};

const getTodos = async ({ sort, pagination, filterMap }) => {
  const fql = getTodosAdvFql({ sort, pagination, filterMap });
  const pageObj = await db.query(fql);
  // console.log("getTodos: pageObj", pageObj);

  // populate: resp
  const items = pageObj.data.map((todo) => ({
    id: getId(todo.ref),
    ...todo.data,
  }));

  const { before, after } = getCursors(pageObj);
  return { data: items, before, after };
};

const getTodo = async ({ id }) => {
  const getTodoByIdQuery = q.Get(q.Ref(q.Collection(COLLECTION_NAME), id)); // getCollectionRef and getDocRefById and GetDoc
  const dbTodo = await db.query(getTodoByIdQuery);
  return { id: getId(dbTodo.ref), ...dbTodo.data };
};

const createTodo = async ({ todo }) => {
  console.log("DAO: createTodos: ", { todo });
  const createDocQuery = q.Create(q.Collection(COLLECTION_NAME), {
    data: todo,
  }); // getCollectionRef and CreateDoc(collectionRef, newDoc)
  const dbTodo = await db.query(createDocQuery);
  return { id: getId(dbTodo.ref), ...dbTodo.data };
};

const createTodos = async ({ todos }) => {
  console.log("DAO: createTodos: ", { todos });

  const createDocsQuery = q.Map(
    todos,
    q.Lambda(
      "todo",
      q.Create(q.Collection(COLLECTION_NAME), { data: q.Var("todo") })
    )
  );
  const resp = await db.query(createDocsQuery);
  // populate: resp
  const dbTodos = resp.map((todo) => ({
    id: getId(todo.ref),
    ...todo.data,
  }));
  return dbTodos;
};

const updateTodo = async ({ id, todo }) => {
  const updateDocQuery = q.Update(q.Ref(q.Collection(COLLECTION_NAME), id), {
    data: todo,
  }); // getCollectionRef and getDocRefById and UpdateDoc(docRef, updatedDocTodo)
  const dbTodo = await db.query(updateDocQuery);
  return { id: getId(dbTodo.ref), ...dbTodo.data };
};

const deleteTodo = async ({ id }) => {
  const deleteDocQuery = q.Delete(q.Ref(q.Collection(COLLECTION_NAME), id)); // getCollectionRef and getDocRefById and DeleteDoc(docRef)
  const dbTodo = await db.query(deleteDocQuery);
  return { id: getId(dbTodo.ref), ...dbTodo.data };
};

const deleteAllTodo = async () => {
  const deleteAllDocQuery = q.Map(
    q.Paginate(q.Match(q.Index("todos_idx"))),
    q.Lambda("todo", q.Delete(q.Var("todo")))
  );
  const dbTodo = await db.query(deleteAllDocQuery);
  return { id: getId(dbTodo.ref), ...dbTodo.data };
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
