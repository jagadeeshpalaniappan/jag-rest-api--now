const faunadb = require("faunadb");
const q = faunadb.query;

const { atob, btoa } = require("./hash.utils");

const getId = (ref) => {
  if (!ref) return null;
  const refObj = JSON.parse(JSON.stringify(ref));
  // console.log("getId: refObj", refObj);
  return refObj && refObj["@ref"] ? refObj["@ref"]["id"] : null;
};

const anyConfig = {
  users: {
    collection: "users",
    defaultIndex: "users_idx_advsearch",
    sortIndex: {
      name: "users_idx_advsearch_sortby@name",
      username: "users_idx_advsearch_sortby@username",
      created: "users_idx_advsearch_sortby@created",
    },

    // defaultSearchIndex: "users_idx_searchable",
    // searchAndSortIndex111: {
    //   name: "users_idx_searchable_sortby@name",
    //   username: "users_idx_searchable_sortby@username",
    //   created: "users_idx_searchable_sortby@created",
    // },
    // searchAndSortIndex: {
    //   name: "users_idx_advsearch_sortby@name",
    //   username: "users_idx_advsearch_sortby@username",
    //   created: "users_idx_advsearch_sortby@created",
    // },
  },
};

const getCursorRef = (ref) => {
  if (!ref) return null;
  const refObj = JSON.parse(JSON.stringify(ref));
  if (refObj && refObj["@ref"]) {
    const id = refObj["@ref"]["id"];
    const collectionRef = refObj["@ref"]["collection"];
    const collection = collectionRef["@ref"]["id"];
    return { id, collection };
  }
  return null;
};

const encodeCursor = (cursor) => {
  // console.log("###encodeCursor###", JSON.stringify(cursor));
  const items = cursor.map((item) => {
    if (typeof item === "string" || item === null) return item;
    if (typeof item === "object") return getCursorRef(item);
  });

  console.log(JSON.stringify(items));
  return atob(JSON.stringify(items));
  // return cursor;
};

const decodeCursor = (cursor) => {
  console.log("###decodeCursor###", JSON.stringify(cursor));
  const cursorDecoded = JSON.parse(btoa(cursor));
  // console.log(cursorDecoded);
  const items = cursorDecoded.map((item) => {
    if (typeof item === "string" || item === null) return item;
    if (typeof item === "object" && item)
      return q.Ref(q.Collection(item.collection), item.id);
  });
  return items;
};

const getCursors = (pageObj) => {
  const before = pageObj.before ? encodeCursor(pageObj.before) : null;
  const after = pageObj.after ? encodeCursor(pageObj.after) : null;
  return { before, after };
};

const getPageConfig = ({ input }) => {
  const { page } = input;
  const { size, before, after } = page;
  const pageConfig = {};
  if (size) pageConfig.size = Number(size);
  if (before) pageConfig.before = decodeCursor(before);
  if (after) pageConfig.after = decodeCursor(after);
  return pageConfig;
};

const getAnyCollectionConfig = ({ collectionName, input }) => {
  const { search, sort } = input;
  const config = anyConfig[collectionName];
  // const collection = config.collection;
  const index = sort ? config.sortIndex[sort] : config.defaultIndex;

  console.log({ input, collection, index, pageConfig });
  return { collection, index, pageConfig };
};

module.exports = {
  getId,
  getAnyCollectionConfig,
  getPageConfig,
  getCursors,
};
