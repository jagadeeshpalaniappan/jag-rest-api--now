const faunadb = require("faunadb");
const q = faunadb.query;
const { getDbConnection } = require("../common/db");
const db = getDbConnection();
const {
  getId,
  getPageConfig,
  getCursors,
} = require("../common/utils/db.utils");

const COLLECTION_NAME = "posts";
const SEARCH_TERMS = ["fuzzySearch", "title", "userId", "isActive"];
const INDEX_CONFIG = {
  defaultIndex: "posts_idx_advsearch",
  sortIndex: {
    updatedTs: "posts_idx_advsearch_sortby@updatedTs",
    title: "posts_idx_advsearch_sortby@title",
    viewCount: "posts_idx_advsearch_sortby@viewCount",
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

const getPostsAdvFql = ({ sort, pagination, filterTerms }) => {
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

const getPosts = async ({ sort, pagination, filterTerms }) => {
  const fql = getPostsAdvFql({ sort, pagination, filterTerms });
  const pageObj = await db.query(fql);
  // console.log("getPosts: pageObj", pageObj);

  // populate: resp
  const items = pageObj.data.map((post) => ({
    id: getId(post.ref),
    ...post.data,
  }));

  const { before, after } = getCursors(pageObj);
  return { data: items, before, after };
};

const getPost = async ({ id }) => {
  const getPostByIdQuery = q.Get(q.Ref(q.Collection(COLLECTION_NAME), id)); // getCollectionRef and getDocRefById and GetDoc
  const dbPost = await db.query(getPostByIdQuery);
  return { id: getId(dbPost.ref), ...dbPost.data };
};

const createPost = async ({ post }) => {
  console.log("DAO: createPosts: ", { post });
  const createDocQuery = q.Create(q.Collection(COLLECTION_NAME), {
    data: post,
  }); // getCollectionRef and CreateDoc(collectionRef, newDoc)
  const dbPost = await db.query(createDocQuery);
  return { id: getId(dbPost.ref), ...dbPost.data };
};

const createPosts = async ({ posts }) => {
  console.log("DAO: createPosts: ", { posts });

  const createDocsQuery = q.Map(
    posts,
    q.Lambda(
      "post",
      q.Create(q.Collection(COLLECTION_NAME), { data: q.Var("post") })
    )
  );
  const resp = await db.query(createDocsQuery);
  // populate: resp
  const dbPosts = resp.map((post) => ({
    id: getId(post.ref),
    ...post.data,
  }));
  return dbPosts;
};

const updatePost = async ({ id, post }) => {
  const updateDocQuery = q.Update(q.Ref(q.Collection(COLLECTION_NAME), id), {
    data: post,
  }); // getCollectionRef and getDocRefById and UpdateDoc(docRef, updatedDocPost)
  const dbPost = await db.query(updateDocQuery);
  return { id: getId(dbPost.ref), ...dbPost.data };
};

const deletePost = async ({ id }) => {
  const deleteDocQuery = q.Delete(q.Ref(q.Collection(COLLECTION_NAME), id)); // getCollectionRef and getDocRefById and DeleteDoc(docRef)
  const dbPost = await db.query(deleteDocQuery);
  return { id: getId(dbPost.ref), ...dbPost.data };
};

const deleteAllPost = async () => {
  const deleteAllDocQuery = q.Map(
    q.Paginate(q.Match(q.Index("posts_idx"))),
    q.Lambda("post", q.Delete(q.Var("post")))
  );
  const dbPost = await db.query(deleteAllDocQuery);
  return { id: getId(dbPost.ref), ...dbPost.data };
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  createPosts,
  updatePost,
  deletePost,
  deleteAllPost,
};
