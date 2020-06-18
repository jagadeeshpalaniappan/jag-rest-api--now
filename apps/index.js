var router = require("express").Router();

// MicroServices: TODO: split into differrent apps later

// APP: DEMO
router.use("/demo", require("./demo"));

// APP: MY-FUTURE-APP
// router.use("/app1/v1/api", require("./app1/v1/api"));
// router.use("/app1/v2/api", require("./app1/v2/api"));

module.exports = router;
