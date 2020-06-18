var router = require("express").Router();

// MicroServices: TODO: split into differrent apps later
// V1:
router.use("/rest/v1/api", require("./api/rest/v1/api/index"));
router.use("/graphql/v1/api", require("./api/graphql/v1/api"));

// V2: placeholder
router.use("/rest/v2/api", require("./api/rest/v2/api/index"));

router.get("/", (req, res) => {
  res.send("Welcome to 'demo' api");
});

module.exports = router;
