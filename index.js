const morgan = require("morgan");

var express = require("express");
var app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Express server is online.");
});

app.get("/get", (req, res, next) => {
  console.log("req.query", req.query);
  res.json({
    query: req.query,
    version: process.env.VERSION,
  });
});

app.post("/post", function (request, response) {
  response.send(request.body);
});

// LOCAL:
const port = process.env.PORT || 3333;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Running: http://localhost:${port}`);
});
