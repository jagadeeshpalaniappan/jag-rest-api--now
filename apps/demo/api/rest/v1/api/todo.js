// API: REST-API

var router = require("express").Router();
const { check, validationResult } = require("express-validator");

const todoService = require("../../../../modules/todo/todo.service");
const {
  parseStr,
  arrToMap,
} = require("../../../../modules/common/utils/all.utils");
const {
  GetTodosInput,
  CreateTodoInput,
  UpdateTodoInput,
} = require("./schema/todo");

const SEARCH_TERMS = ["fuzzySearch", "role", "sex", "isActive"];

async function getTodos(req, res) {
  try {
    // VALIDATE:
    const { value: input, error } = await GetTodosInput.validate({
      ...req.query,
      filters: parseStr(req.query.filters) || [],
    });
    if (error) res.status(400).json({ error });

    // POPULATE:
    const { search, sort, pageSize, pageBefore, pageAfter, filters } = input;
    const filterBy = arrToMap(filters);
    const pagination = { size: pageSize, before: pageBefore, after: pageAfter };
    const filterTerms = { ...filterBy, fuzzySearch: search };

    // TX:
    const options = { sort, pagination, filterTerms };
    const { data, before, after } = await todoService.getTodos(options);

    // RESP:
    res.json({ data, meta: { before, after } });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getTodo(req, res) {
  try {
    const { id } = req.params;
    const todo = await todoService.getTodo({ id });

    // RESP:
    res.json({ todo });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function createTodo(req, res) {
  try {
    // VALIDATE:
    const { value: todo, error } = await CreateTodoInput.validate(req.body);
    if (error) res.status(400).json({ error });

    // TX:
    const createdTodos = await todoService.createTodos({ todos: [todo] }); // bulkCreate

    // RESP:
    const output =
      createdTodos && createdTodos.length === 1
        ? createdTodos[0]
        : createdTodos;
    res.json(output);
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function updateTodo(req, res) {
  try {
    const { id } = req.params;
    // VALIDATE:
    const { value: todo, error } = await UpdateTodoInput.validate(req.body);
    if (error) res.status(400).json({ error });

    // TX:
    const updatedTodo = await todoService.updateTodo({ id, todo });

    // RESP:
    res.json({ todo: updatedTodo });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function deleteAllTodo(req, res) {
  try {
    const deletedTodos = await todoService.deleteAllTodo();
    res.json({ todos: deletedTodos });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function deleteTodo(req, res) {
  try {
    const { id } = req.params;
    const deletedTodo = await todoService.deleteTodo({ id });
    res.json({ todo: deletedTodo });
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteAllTodo,
};
