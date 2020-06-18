require("dotenv").config();
const faunadb = require("faunadb");
const q = faunadb.query;
const { logger } = faunadb.clientLogger;

const {
  createCollection,
  createDefaultIndex,
  createSortedIndex,
  createFilterableIndex,
  createSearchableIndex,
  createSearchableSortedIndex,
  createAdvSearchBySort,
  createJagIndex,
} = require("./scripts/schema");
// console.log(`###${process.env.FAUNADB_SERVER_SECRET}###`);
var client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
  // observer: logger(console.log),
});

const SEARCH_TERMS = ["fuzzySearch", "role", "sex", "isActive"];
const INDEX_CONFIG = {
  defaultIndex: "users_idx_advsearch",
  sortIndex: {
    name: "users_idx_advsearch_sortby@name",
    username: "users_idx_advsearch_sortby@username",
    updatedTs: "users_idx_advsearch_sortby@updatedTs",
  },
};

async function main() {
  try {
    // await createCollection({ client, name: "users" });
    /* 
    await createDefaultIndex({
      client,
      name: "users_idx",
      collectionName: "users",
    });
     */
    /* 
    // 1: NO_SORT
    const searchConfig = {
      searchFields: ["fuzzySearch", "role", "sex", "isActive"], // nothing but 'filters'
    };
    await createAdvSearchBySort({
      client,
      collectionName: "users",
      name: "users_idx_advsearch",
      // sortField: ["ts"],
      searchConfig,
    });
    */
    /*
    // 2: SORTBY-NAME
    const searchConfig = {
      searchFields: ["fuzzySearch", "role", "sex", "isActive"], // nothing but 'filters'
    };
    await createAdvSearchBySort({
      client,
      collectionName: "users",
      name: "users_idx_advsearch_sortby@name",
      sortField: ["data", "name"],
      searchConfig,
    });
    */
    /*
    // 3: SORTBY-USERNAME
    const searchConfig = {
      searchFields: ["fuzzySearch", "role", "sex", "isActive"], // nothing but 'filters'
    };
    await createAdvSearchBySort({
      client,
      collectionName: "users",
      name: "users_idx_advsearch_sortby@username",
      sortField: ["data", "username"],
      searchConfig,
    });
    */
    /*
    // 4: SORTBY-LASTUPDATED
    const searchConfig = {
      searchFields: ["fuzzySearch", "role", "sex", "isActive"], // nothing but 'filters'
    };
    await createAdvSearchBySort({
      client,
      collectionName: "users",
      name: "users_idx_advsearch_sortby@updatedTs",
      sortField: ["ts"],
      searchConfig,
    });
    */
  } catch (e) {
    console.log("##ERROR##");
    console.log(e);
  }
}

main();
