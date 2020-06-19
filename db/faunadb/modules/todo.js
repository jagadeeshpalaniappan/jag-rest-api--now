const faunadb = require("faunadb");
const q = faunadb.query;
const { logger } = faunadb.clientLogger;

const {
  createCollection,
  createDefaultIndex,
  createAdvSearchBySort,
} = require("../scripts/schema");
// console.log(`###${process.env.FAUNADB_SERVER_SECRET}###`);
var client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
  // observer: logger(console.log),
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const COLLECTION_NAME = "todos";

const SEARCH_TERMS = ["fuzzySearch", "title", "userId", "isActive"];
const INDEX_CONFIG = {
  defaultIndex: "todos_idx_advsearch",
  sortIndex: {
    updatedTs: "todos_idx_advsearch_sortby@updatedTs",
    title: "todos_idx_advsearch_sortby@title",
  },
};

const SEARCH_CONFIG = {
  searchFields: SEARCH_TERMS,
  // searchStrategy: ".....TODO.....",
};

async function main() {
  try {
    await createCollection({ client, name: COLLECTION_NAME });

    await sleep(500);

    await createDefaultIndex({
      client,
      name: "todos_idx",
      collectionName: COLLECTION_NAME,
    });

    await sleep(500);

    // 1: NO_SORT
    await createAdvSearchBySort({
      client,
      collectionName: COLLECTION_NAME,
      name: "todos_idx_advsearch",
      searchConfig: SEARCH_CONFIG,
    });

    await sleep(500);

    // 2: SORTBY-updatedTs
    await createAdvSearchBySort({
      client,
      collectionName: COLLECTION_NAME,
      name: "todos_idx_advsearch_sortby@updatedTs",
      sortField: ["ts"],
      searchConfig: SEARCH_CONFIG,
    });

    await sleep(500);

    // 3: SORTBY-title
    await createAdvSearchBySort({
      client,
      collectionName: COLLECTION_NAME,
      name: "todos_idx_advsearch_sortby@title",
      sortField: ["data", "title"],
      searchConfig: SEARCH_CONFIG,
    });
  } catch (e) {
    console.log("##ERROR##");
    console.log(e);
  }
}

module.exports = main;
