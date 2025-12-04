import assert from "node:assert/strict";
import { APIClient } from "../api.js";

const client = new APIClient();

const testFetchUsers = async () => {
  const users = await client.fetchUsers();

  assert.ok(Array.isArray(users), "fetchUsers should return an array");
  assert.ok(users.length > 0, "users array should not be empty");
  assert.ok(users[0], "first user should exist");

  console.log("fetchUsers passed");
};

const testFetchTodos = async () => {
  const todos = await client.fetchTodos();

  assert.ok(Array.isArray(todos), "fetchTodos should return an array");
  assert.ok(todos.length > 0, "todos array should not be empty");
  assert.ok(todos[0], "first todo should exist");

  console.log("fetchTodos passed");
};

const testFetchTodosByUserId = async () => {
  const todos = await client.fetchTodosByUserId(1);

  assert.ok(Array.isArray(todos), "fetchTodosByUserId should return an array");
  assert.ok(todos.length > 0, "todos for user 1 should not be empty");
  assert.equal(todos[0].isCreatedBy(1), true, "todo should belong to user 1");

  console.log("fetchTodosByUserId passed");
};

const run = async () => {
  await testFetchUsers();
  await testFetchTodos();
  await testFetchTodosByUserId();
};

run();
