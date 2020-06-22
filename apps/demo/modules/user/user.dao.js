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
    updatedTs: "users_idx_advsearch_sortby@updatedTs",
  },
};

const getIndexName = (sort) => {
  return sort ? INDEX_CONFIG.sortIndex[sort] : INDEX_CONFIG.defaultIndex;
};

const getSearchValues = (filterTerms) => {
  return SEARCH_TERMS.map((terms) => {
    if (
      filterTerms &&
      filterTerms[terms] !== undefined &&
      filterTerms[terms] !== null
    )
      return filterTerms[terms];
    else return "*";
  });
};

const getUsersAdvFql = ({ sort, pagination, filterTerms }) => {
  const pageConfig = getPageConfig(pagination);
  const index = getIndexName(sort);

  // SEARCH_VAL_ARR:
  const searchVals = getSearchValues(filterTerms);

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

const getUsers = async ({ sort, pagination, filterTerms }) => {
  const fql = getUsersAdvFql({ sort, pagination, filterTerms });
  const pageObj = await db.query(fql);
  // console.log("getUsers: pageObj", pageObj);

  // populate: resp
  const items = pageObj.data.map((user) => ({
    id: getId(user.ref),
    ...user.data,
  }));

  const { before, after } = getCursors(pageObj);
  return { data: items, before, after };
};

const getUser = async ({ id }) => {
  const getUserByIdQuery = q.Get(q.Ref(q.Collection(COLLECTION_NAME), id)); // getCollectionRef and getDocRefById and GetDoc
  const dbUser = await db.query(getUserByIdQuery);
  return { id: getId(dbUser.ref), ...dbUser.data };
};

const createUser = async ({ user }) => {
  console.log("DAO: createUsers: ", { user });
  const createDocQuery = q.Create(q.Collection(COLLECTION_NAME), {
    data: user,
  }); // getCollectionRef and CreateDoc(collectionRef, newDoc)
  const dbUser = await db.query(createDocQuery);
  return { id: getId(dbUser.ref), ...dbUser.data };
};

const createUsers = async ({ users }) => {
  console.log("DAO: createUsers: ", { users });

  const createDocsQuery = q.Map(
    users,
    q.Lambda(
      "user",
      q.Create(q.Collection(COLLECTION_NAME), { data: q.Var("user") })
    )
  );
  const resp = await db.query(createDocsQuery);
  // populate: resp
  const dbUsers = resp.map((user) => ({
    id: getId(user.ref),
    ...user.data,
  }));
  return dbUsers;
};

const updateUser = async ({ id, user }) => {
  const updateDocQuery = q.Update(q.Ref(q.Collection(COLLECTION_NAME), id), {
    data: user,
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
    q.Paginate(q.Match(q.Index("users_idx"))),
    q.Lambda("user", q.Delete(q.Var("user")))
  );
  const dbUser = await db.query(deleteAllDocQuery);
  return { id: getId(dbUser.ref), ...dbUser.data };
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
