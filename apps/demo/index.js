var router = require("express").Router();

// MicroServices: TODO: split into differrent apps later
router.use("/v1/api", require("./v1/api"));
router.use("/v2/api", require("./v2/api"));

router.get("/", (req, res) => {
  res.send("Welcome to 'demo' api");
});

module.exports = router;
