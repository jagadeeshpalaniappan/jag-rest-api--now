var router = require("express").Router();

// MicroServices: TODO: split into differrent apps later
// V1:
router.use("/v1/api", require("./v1/api"));
router.use("/v1/graphql", require("./v1/graphql"));

// V2: placeholder
router.use("/v2/api", require("./v2/api"));

router.get("/", (req, res) => {
  res.send("Welcome to 'demo' api");
});

module.exports = router;
