// var express = require("express");
// var appsRouter = require("./apps/index");
// var app = express();
// app.use(express.json());
// app.use(morgan("dev"));
// app.use("/", appsRouter);

// // app.get("/", (req, res) => {
// //   res.send("Server is running...");
// // });

require("dotenv").config();
const morgan = require("morgan");
var express = require("express");
var app = express();
app.use(express.json());
app.use(morgan("dev"));

// API:
app.use("/", require("./apps"));

const port = process.env.PORT || 3333;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Running: http://localhost:${port}`);
});
