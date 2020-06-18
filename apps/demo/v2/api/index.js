var router = require("express").Router();

// api/products
router.get("/users", function (req, res) {
  res.json({ users: [], query: req.query, version: 2 });
});

// api/products/:id
router.get("/users/:id", function (req, res) {
  res.json({ id: req.params.id });
});

module.exports = router;
