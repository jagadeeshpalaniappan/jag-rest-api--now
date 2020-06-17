var express = require("express");
var api = express.Router();

api.get("/users", (req, res, next) => {
  console.log("req.query", req.query);
  res.json({
    query: req.query,
    version: process.env.VERSION,
  });
});

module.exports = api;
