const faunadb = require("faunadb");
const q = faunadb.query;
const { getDbConnection } = require("../common/db");
const db = getDbConnection();
const {
  getId,
  getPageConfig,
  getCursors,
} = require("../common/utils/db.utils");

const COLLECTION_NAME = "users";
const SEARCH_TERMS = ["fuzzySearch", "role", "sex", "isActive"];
const INDEX_CONFIG = {
  defaultIndex: "users_idx_advsearch",
  sortIndex: {
    name: "users_idx_advsearch_sortby@name",
    username: "users_idx_advsearch_sortby@username",
    created: "users_idx_advsearch_sortby@created",
  },
};

const getIndexName = (sort) => {
  return sort ? INDEX_CONFIG.sortIndex[sort] : INDEX_CONFIG.defaultIndex;
};

const getSearchValues = (filterMap) => {
  return SEARCH_TERMS.map((terms) => (filterMap && filterMap[terms]) || "*");
};

const getUsersAdvFql = ({ input }) => {
  const { sort, filterMap } = input;
  const pageConfig = getPageConfig({ input });
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

const getUsers = async ({ anyCollection, input }) => {
  const fql = getUsersAdvFql({ anyCollection, input });
  const pageObj = await db.query(fql);
  console.log("getUsers: pageObj", pageObj);

  // populate: resp
  const items = pageObj.data.map((item) => ({
    id: getId(item.ref),
    ...item.data,
  }));

  const { before, after } = getCursors(pageObj);
  console.log({ before, after });

  return { data: items, before, after };
};

const getUser = async ({ id }) => {
  console.log("DAO:getUser:", { id });
  const getUserByIdQuery = q.Get(q.Ref(q.Collection(COLLECTION_NAME), id)); // getCollectionRef and getDocRefById and GetDoc
  const dbUser = await db.query(getUserByIdQuery);
  return { id: getId(dbUser.ref), ...dbUser.data };
};

const addUser = async ({ item }) => {
  const createDocQuery = q.Create(q.Collection(COLLECTION_NAME), {
    data: item,
  }); // getCollectionRef and CreateDoc(collectionRef, newDoc)
  const dbUser = await db.query(createDocQuery);
  return { id: getId(dbUser.ref), ...dbUser.data };
};

const updateUser = async ({ id, item }) => {
  const updateDocQuery = q.Update(q.Ref(q.Collection(COLLECTION_NAME), id), {
    data: item,
  }); // getCollectionRef and getDocRefById and UpdateDoc(docRef, updatedDocUser)
  const dbUser = await db.query(updateDocQuery);
  return { id: getId(dbUser.ref), ...dbUser.data };
};

const deleteUser = async ({ id }) => {
  const deleteDocQuery = q.Delete(q.Ref(q.Collection(COLLECTION_NAME), id)); // getCollectionRef and getDocRefById and DeleteDoc(docRef)
  const dbUser = await db.query(deleteDocQuery);
  return { id: getId(dbUser.ref), ...dbUser.data };
};

const deleteAllUser = async () => {
  const deleteAllDocQuery = q.Map(
    q.Paginate(q.Match(q.Index("all_users"))),
    q.Lambda("item", q.Delete(q.Var("item")))
  );
  const dbUser = await db.query(deleteAllDocQuery);
  return { id: getId(dbUser.ref), ...dbUser.data };
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  deleteAllUser,
};
