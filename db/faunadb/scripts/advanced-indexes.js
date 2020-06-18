const faunadb = require("faunadb");
const q = faunadb.query;
const { GenerateKeywords } = require("./fuzzySearch/words");
const { GetArrWithWildcard } = require("./fuzzySearch/utils");

const getBindingFields = (searchConfig) => {
  const { searchFields } = searchConfig;
  const fields = {};

  // EXACT-SEARCH:
  for (let i = 0, len = searchFields.length; i < len; i++) {
    const searchField = searchFields[i];

    if (searchField === "fuzzySearch") {
      fields[searchField] = q.Query(
        q.Lambda("eachDoc", GenerateKeywords(q.Var("eachDoc")))
      );
    } else {
      fields[searchField] = q.Query(
        q.Lambda(
          "eachDoc",
          GetArrWithWildcard(q.Select(["data", searchField], q.Var("eachDoc")))
        )
      );
    }
  }
  return fields;
};

const getSearchTerms = (searchConfig) => {
  const { searchFields } = searchConfig;
  const searchTerms = searchFields.map((searchField) => ({
    binding: searchField,
  }));
  return searchTerms;
};

const getSortValues = (sortField) => {
  return sortField ? [{ field: sortField }, { field: ["ref"] }] : null;
};

async function createAdvSearchBySort({
  client,
  name,
  collectionName,
  sortField,
  searchConfig,
}) {
  const bindingFields = getBindingFields(searchConfig);
  const searchTerms = getSearchTerms(searchConfig);
  const sortValues = getSortValues(sortField);
  const fql = q.CreateIndex({
    name,
    source: {
      collection: q.Collection(collectionName),
      fields: bindingFields, //bindings: computedVals
    },
    terms: searchTerms,
    values: sortValues,
  });

  console.log(fql);
  const resp = await client.query(fql);
  console.log(resp);
  return resp;
}

module.exports = { createAdvSearchBySort };
