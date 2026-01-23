import { Todo, TodoStatus } from "./models.js";

/**
 * Filters an array of Todos by their status
 * @param {Todo[]} todos - array of todos to filter
 * @param {TodoStatus} status - task status to filter by
 */
export const filterByStatus = (todos, status) => {
  return todos.filter((task) => task.getStatus() === status);
};

/**
 * Calculates the total todos, number of completed and pending todos
 * @param {Todo[]} todos
 */
export const calculateStatistics = (todos) => {
  const total = todos.length;
  const nCompleted = todos.filter(
    (t) => t.getStatus() === TodoStatus.COMPLETE,
  ).length;
  return { total, nCompleted, nPending: total - nCompleted };
};

/**
 * Groups the todos by userId
 * @param {Todo[]} todos
 */
export const groupByUser = (todos) => {
  return todos.reduce((acc, t) => {
    (acc[t.userId] ||= []).push(t);
    return acc;
  }, {});
};
