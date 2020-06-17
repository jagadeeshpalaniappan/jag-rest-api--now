const morgan = require("morgan");
var express = require("express");
var apiRouter = require("./api/index");
var app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1", apiRouter);

// app.get("/", (req, res) => {
//   res.send("Server is running...");
// });

// LOCAL:
const port = process.env.PORT || 3333;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Running: http://localhost:${port}`);
});
