const faunadb = require("faunadb");
const FAUNADB_SERVER_SECRET = process.env.FAUNADB_SERVER_SECRET;
// console.log({ FAUNADB_SERVER_SECRET });

var db = new faunadb.Client({ secret: FAUNADB_SERVER_SECRET });
const getDbConnection = () => {
  // console.log({ FAUNADB_SERVER_SECRET });
  return db;
};

module.exports = { getDbConnection };
