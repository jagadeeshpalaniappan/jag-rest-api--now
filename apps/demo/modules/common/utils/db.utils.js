const faunadb = require("faunadb");
const q = faunadb.query;

const { atob, btoa } = require("./hash.utils");

const getId = (ref) => {
  if (!ref) return null;
  const refObj = JSON.parse(JSON.stringify(ref));
  // console.log("getId: refObj", refObj);
  return refObj && refObj["@ref"] ? refObj["@ref"]["id"] : null;
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
    if (item && typeof item === "object") return getCursorRef(item);
    return item;
  });

  // console.log(JSON.stringify(items));
  return atob(JSON.stringify(items));
  // return cursor;
};

const decodeCursor = (cursor) => {
  const cursorDecoded = JSON.parse(btoa(cursor));
  console.log("###decodeCursor###", cursorDecoded);

  const items = cursorDecoded.map((item) => {
    if (item && typeof item === "object")
      return q.Ref(q.Collection(item.collection), item.id);
    return item;
  });
  return items;
};

const getCursors = (pageObj) => {
  const before = pageObj.before ? encodeCursor(pageObj.before) : null;
  const after = pageObj.after ? encodeCursor(pageObj.after) : null;
  return { before, after };
};

const getPageConfig = (page) => {
  const { size, before, after } = page || {};
  const pageConfig = {};
  if (size) pageConfig.size = size;
  if (before) pageConfig.before = decodeCursor(before);
  if (after) pageConfig.after = decodeCursor(after);
  return pageConfig;
};

module.exports = {
  getId,
  getPageConfig,
  getCursors,
};
