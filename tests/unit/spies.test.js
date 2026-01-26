import { Todo, User, TodoStatus } from "../../core/models.js";
import {
  filterByStatus,
} from "../../core/taskProcessor.js";

describe("Jest Spies - Function Call Verification (15% of tests)", () => {
  describe("Spy Test 1: Array.filter() method calls", () => {
    test("should verify filter() is called with correct callback in getTodosByStatus()", () => {
      const todo1 = new Todo("1", "Task 1", false, "user1");
      const todo2 = new Todo("2", "Task 2", true, "user1");
      const todo3 = new Todo("3", "Task 3", false, "user1");
      const user = new User("user1", "John Doe", "john@example.com", [
        todo1,
        todo2,
        todo3,
      ]);

      const filterSpy = jest.spyOn(user.todos, "filter");

      const result = user.getTodosByStatus(TodoStatus.COMPLETE);

      expect(filterSpy).toHaveBeenCalled();
      expect(filterSpy).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0].isCompleted).toBe(true);

      filterSpy.mockRestore();
    });
  });

  describe("Spy Test 2: Array.reduce() method calls", () => {
    test("should verify reduce() is called once when calculating completion rate", () => {
      const todo1 = new Todo("1", "Task 1", true, "user1");
      const todo2 = new Todo("2", "Task 2", true, "user1");
      const todo3 = new Todo("3", "Task 3", false, "user1");
      const user = new User("user1", "Jane Smith", "jane@example.com", [
        todo1,
        todo2,
        todo3,
      ]);

      const reduceSpy = jest.spyOn(user.todos, "reduce");

      const completionRate = user.getCompletionRate();

      expect(reduceSpy).toHaveBeenCalled();
      expect(reduceSpy).toHaveBeenCalledTimes(1);
      expect(completionRate).toBeCloseTo(0.6667, 3);

      reduceSpy.mockRestore();
    });
  });

  describe("Spy Test 3: Internal method calls within classes", () => {
    test("should verify getStatus() is called for each todo in getCompletionRate()", () => {
      const todo1 = new Todo("1", "Task 1", false, "user1");
      const todo2 = new Todo("2", "Task 2", true, "user1");
      const user = new User("user1", "Test User", "test@example.com", [
        todo1,
        todo2,
      ]);

      const getStatusSpy1 = jest.spyOn(todo1, "getStatus");
      const getStatusSpy2 = jest.spyOn(todo2, "getStatus");

      user.getCompletionRate();

      expect(getStatusSpy1).toHaveBeenCalled();
      expect(getStatusSpy2).toHaveBeenCalled();
      expect(getStatusSpy1).toHaveBeenCalledTimes(1);
      expect(getStatusSpy2).toHaveBeenCalledTimes(1);

      getStatusSpy1.mockRestore();
      getStatusSpy2.mockRestore();
    });
  });

  describe("Spy Test 4: Array.push() method calls", () => {
    test("should verify push() is called with correct arguments when adding todo", () => {
      const user = new User("user1", "Alice Smith", "alice@example.com", []);
      const newTodo = new Todo("10", "New Task", false, "user1");

      const pushSpy = jest.spyOn(user.todos, "push");

      user.addTodo(newTodo);

      expect(pushSpy).toHaveBeenCalled();
      expect(pushSpy).toHaveBeenCalledWith(newTodo);
      expect(pushSpy).toHaveBeenCalledTimes(1);
      expect(user.todos).toContain(newTodo);

      pushSpy.mockRestore();
    });
  });

  describe("Spy Test 5: Console method calls", () => {
    test("should verify console.error is called when fromDict receives invalid data", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const result = Todo.fromDict(null);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy.mock.calls[0][0]).toContain(
        "Couldn't create user from dict",
      );
      expect(result).toBeUndefined();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Spy Test 6: Array.filter() in taskProcessor functions", () => {
    test("should verify filter() is called with correct status predicate in filterByStatus()", () => {
      const todos = [
        new Todo("1", "Task 1", true, "user1"),
        new Todo("2", "Task 2", false, "user2"),
        new Todo("3", "Task 3", true, "user3"),
      ];

      const filterSpy = jest.spyOn(todos, "filter");

      const result = filterByStatus(todos, TodoStatus.COMPLETE);

      expect(filterSpy).toHaveBeenCalled();
      expect(filterSpy).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result.every((todo) => todo.isCompleted === true)).toBe(true);

      filterSpy.mockRestore();
    });
  });
});
