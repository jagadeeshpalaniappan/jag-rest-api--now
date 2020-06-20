// API: REST-API

var router = require("express").Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deleteAllUser,
} = require("./user");

// -------------------- USER  --------------------
// /api/v1/users
router.get("/users", getUsers); // GET-ALL
router.get("/users/:id", getUser); // GET
router.post("/users", createUser); // CREATE
router.put("/users/:id", updateUser); // UPDATE:
router.delete("/users", deleteAllUser); // DELETE-ALL
router.delete("/users/:id", deleteUser); // DELETE:

// // -------------------- USER  --------------------
// // /api/v1/posts
// router.get("/posts", getPosts); // GET-ALL
// router.get("/posts/:id", getPost); // GET
// router.post("/posts", createPost); // CREATE
// router.put("/posts/:id", updatePost); // UPDATE:
// router.delete("/posts", deleteAllPost); // DELETE-ALL
// router.delete("/posts/:id", deletePost); // DELETE:

// // -------------------- USER  --------------------
// // /api/v1/todos
// router.get("/todos", getTodos); // GET-ALL
// router.get("/todos/:id", getTodo); // GET
// router.post("/todos", createTodo); // CREATE
// router.put("/todos/:id", updateTodo); // UPDATE:
// router.delete("/todos", deleteAllTodo); // DELETE-ALL
// router.delete("/todos/:id", deleteTodo); // DELETE:

module.exports = router;
