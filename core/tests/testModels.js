import { Todo, PriorityTodo, User, TodoStatus } from "../models.js";

const task1 = new Todo("t1", "Do homework", false, "u1");
task1.toggle();
const taska = new Todo("t2", "Do homework", false, "u1");
const taskb = new Todo("t3", "Do homework", false, "u1");
const taskc = new Todo("t4", "Do homework", false, "u1");
console.log("Task1 status:", task1.getStatus?.() ?? "No status method");

const task2 = new PriorityTodo(
  "t2",
  "Submit report",
  false,
  "u1",
  1,
  new Date(Date.now() - 1000 * 60 * 60),
);
console.log("Task2 overdue:", task2.isOverDue());
console.log("Task2 status:", task2.getStatus());

const user = new User(
  "u1",
  "Alice",
  "[alice@example.com](mailto:alice@example.com)",
  [],
);

user.addTodo(task1);
user.addTodo(task2);
user.addTodo(taska);
user.addTodo(taskb);
user.addTodo(taskc);

console.log("Completion Rate: ", user.getCompletionRate() * 100, "%");

console.log(user.getTodosByStatus(TodoStatus.PENDING))
