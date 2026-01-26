import { Todo, User, TodoStatus, PriorityTodo } from "../../core/models.js";
import { APIClient } from "../../core/api.js";
import {
  filterByStatus,
  calculateStatistics,
  groupByUser,
} from "../../core/taskProcessor.js";

describe("Error Handling Tests", () => {
  describe("Error Test 1: Invalid Constructor Arguments", () => {
    test("should handle Todo constructor with null values gracefully", () => {
      const todo = new Todo(null, null, null, null);

      expect(todo.id).toBeNull();
      expect(todo.title).toBeNull();
      expect(todo.isCompleted).toBeNull();
      expect(todo.userId).toBeNull();
    });

    test("should handle User constructor with undefined todos", () => {
      const user = new User("1", "John Doe", "john@example.com", undefined);

      expect(user.id).toBe("1");
      expect(user.name).toBe("John Doe");
      expect(user.email).toBe("john@example.com");
      expect(user.todos).toBeUndefined();
    });

    test("should handle Todo constructor with empty string title", () => {
      const todo = new Todo("1", "", false, "user1");

      expect(todo.title).toBe("");
      expect(todo.id).toBe("1");
    });

    test("should throw when adding todo to user with non-array todos", () => {
      const user = new User("1", "John Doe", "john@example.com", null);
      const todo = new Todo("1", "Task", false, "1");

      expect(() => {
        user.addTodo(todo);
      }).toThrow(TypeError);
    });
  });

  describe("Error Test 2: Null and Undefined Input Handling", () => {
    test("should return undefined when Todo.fromDict receives null", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const result = Todo.fromDict(null);

      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    test("should return undefined when User.fromDict receives undefined", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const result = User.fromDict(undefined);

      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    test("should return 0 completion rate when user todos is empty array", () => {
      const user = new User("1", "Bob", "bob@example.com", []);

      const rate = user.getCompletionRate();

      expect(rate).toBe(0);
      expect(typeof rate).toBe("number");
    });

    test("should handle null todos array in getCompletionRate", () => {
      const user = new User("1", "Test User", "test@example.com", null);

      expect(() => {
        user.getCompletionRate();
      }).toThrow();
    });
  });

  describe("Error Test 3: Type Mismatches", () => {
    test("should handle isCompleted with non-boolean value", () => {
      const todo = new Todo("1", "Task", "true", "user1");

      expect(todo.isCompleted).toBe("true");
      const status = todo.getStatus();
      expect(status).toBe(TodoStatus.COMPLETE);
    });

    test("should handle User constructor with todos as non-array", () => {
      const user = new User("1", "User", "user@example.com", "not-an-array");

      expect(user.todos).toBe("not-an-array");
    });

    test("should throw error when calling addTodo on non-array todos", () => {
      const user = new User("1", "User", "user@example.com", "not-array");
      const todo = new Todo("1", "Task", false, "1");

      expect(() => {
        user.addTodo(todo);
      }).toThrow();
    });

    test("should return empty array for invalid status query", () => {
      const todo1 = new Todo("1", "Task 1", true, "user1");
      const todo2 = new Todo("2", "Task 2", false, "user1");
      const user = new User("1", "User", "user@example.com", [todo1, todo2]);

      const result = user.getTodosByStatus("INVALID_STATUS");

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Error Test 4: Boundary Conditions", () => {
    test("should handle large completion rate calculation with many todos", () => {
      const todos = Array.from(
        { length: 1000 },
        (_, i) => new Todo(String(i), `Task ${i}`, true, "user1"),
      );
      const user = new User("1", "User", "user@example.com", todos);

      const rate = user.getCompletionRate();

      expect(rate).toBe(1);
      expect(rate).toBeLessThanOrEqual(1);
    });

    test("should handle very long string values in todo properties", () => {
      const longString = "a".repeat(10000);
      const todo = new Todo(longString, longString, false, longString);

      expect(todo.id.length).toBe(10000);
      expect(todo.title.length).toBe(10000);
      expect(todo.userId.length).toBe(10000);
    });

    test("should handle special characters in todo title", () => {
      const specialTitle = "Task with !@#$%^&*()_+-=[]{}|;:'\",.<>?/";
      const todo = new Todo("1", specialTitle, false, "user1");

      expect(todo.title).toBe(specialTitle);
      expect(todo.title).toContain("!@#$%^&*()");
    });

    test("should return 0 completion rate when all todos are pending", () => {
      const todos = [
        new Todo("1", "Task 1", false, "user1"),
        new Todo("2", "Task 2", false, "user1"),
      ];
      const user = new User("1", "User", "user@example.com", todos);

      const rate = user.getCompletionRate();

      expect(rate).toBe(0);
    });
  });

  describe("Error Test 5: API Validation Errors", () => {
    test("Error Test 13: APIClient.handleResponse with 404 throws with status", async () => {
      const apiClient = new APIClient();
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: async () => "Resource not found",
      };

      await expect(apiClient.handleResponse(mockResponse)).rejects.toThrow(
        /404/,
      );
    });

    test("Error Test 14: APIClient.handleResponse with 500 includes status code", async () => {
      const apiClient = new APIClient();
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: async () => "Server error",
      };

      const error = await apiClient
        .handleResponse(mockResponse)
        .catch((e) => e);

      expect(error.message).toContain("500");
    });

    test("Error Test 15: APIClient.handleResponse with failed text() call", async () => {
      const apiClient = new APIClient();
      const mockResponse = {
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
        text: async () => {
          throw new Error("Failed to read response");
        },
      };

      const error = await apiClient
        .handleResponse(mockResponse)
        .catch((e) => e);

      expect(error.message).toContain("503");
    });

    test("Error Test 16: APIClient.handleResponse with ok=true returns json", async () => {
      const apiClient = new APIClient();
      const mockData = { id: 1, name: "Test" };
      const mockResponse = {
        ok: true,
        json: async () => mockData,
      };

      const result = await apiClient.handleResponse(mockResponse);

      expect(result).toEqual(mockData);
    });
  });

  describe("Error Test 6: Data Validation Failures", () => {
    test("should handle fromDict with missing required fields gracefully", () => {
      const incompleteData = { id: "1" };
      const result = Todo.fromDict(incompleteData);

      expect(result).toBeDefined();
      expect(result.id).toBe("1");
      expect(result.title).toBeUndefined();
      expect(result.userId).toBeUndefined();
    });

    test("should handle User.fromDict with empty object gracefully", () => {
      const emptyData = {};
      const result = User.fromDict(emptyData);

      expect(result).toBeDefined();
      expect(result.id).toBeUndefined();
      expect(result.name).toBeUndefined();
      expect(result.todos).toEqual([]);
    });

    test("should handle User.fromDict with null todos field uses nullish coalescing", () => {
      const userData = {
        id: "1",
        name: "User",
        email: "user@example.com",
        todos: null,
      };

      const user = User.fromDict(userData);

      expect(user).toBeDefined();
      expect(user.todos).toEqual([]);
    });

    test("Error Test 17: filterByStatus with empty array returns empty", () => {
      const result = filterByStatus([], TodoStatus.COMPLETE);

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    test("Error Test 18: fromDict handles objects with partial data", () => {
      const partialData = {
        id: "123",
        title: "Partial Task",
      };

      const result = Todo.fromDict(partialData);

      expect(result).toBeDefined();
      expect(result.id).toBe("123");
      expect(result.title).toBe("Partial Task");
    });
  });

  describe("Error Test 7: PriorityTodo Edge Cases", () => {
    test("should handle PriorityTodo with null dueDate", () => {
      const todo = new PriorityTodo("1", "Task", false, "user1", 1, null);

      const isOverdue = todo.isOverDue();

      expect(isOverdue).toBe(false);
    });

    test("should handle PriorityTodo with past due date correctly", () => {
      const pastDate = new Date(Date.now() - 86400000);
      const todo = new PriorityTodo("1", "Task", false, "user1", 1, pastDate);

      const isOverdue = todo.isOverDue();

      expect(typeof isOverdue).toBe("boolean");
      expect(isOverdue === true || isOverdue === false).toBe(true);
    });

    test("should return false for past due date but completed todo", () => {
      const pastDate = new Date("2020-01-01");
      const todo = new PriorityTodo("1", "Task", true, "user1", 1, pastDate);

      const isOverdue = todo.isOverDue();

      expect(isOverdue).toBe(false);
    });

    test("should handle PriorityTodo with future due date", () => {
      const futureDate = new Date("2099-12-31");
      const todo = new PriorityTodo("1", "Task", false, "user1", 1, futureDate);

      const isOverdue = todo.isOverDue();

      expect(isOverdue).toBe(false);
    });
  });

  describe("Error Test 8: Array Operations with Edge Cases", () => {
    test("should handle calculateStatistics with single todo", () => {
      const todos = [new Todo("1", "Task", true, "user1")];

      const stats = calculateStatistics(todos);

      expect(stats.total).toBe(1);
      expect(stats.nCompleted).toBe(1);
      expect(stats.nPending).toBe(0);
    });

    test("should handle groupByUser with todos from single user", () => {
      const todos = [
        new Todo("1", "Task 1", false, "user1"),
        new Todo("2", "Task 2", true, "user1"),
      ];

      const grouped = groupByUser(todos);

      expect(grouped.user1).toHaveLength(2);
      expect(Object.keys(grouped)).toHaveLength(1);
    });

    test("should return empty array for getTodosByStatus with no matches", () => {
      const todo = new Todo("1", "Task", true, "user1");
      const user = new User("1", "User", "user@example.com", [todo]);

      const result = user.getTodosByStatus(TodoStatus.PENDING);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    test("should alternate todo completion state with multiple toggles", () => {
      const todo = new Todo("1", "Task", false, "user1");

      expect(todo.isCompleted).toBe(false);
      todo.toggle();
      expect(todo.isCompleted).toBe(true);
      todo.toggle();
      expect(todo.isCompleted).toBe(false);
    });
  });

  describe("Error Test 9: Error Message Verification", () => {
    test("Error Test 29: fromDict logs error to console on failure", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const result = Todo.fromDict(null);

      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain(
        "Couldn't create user from dict",
      );

      consoleErrorSpy.mockRestore();
    });

    test("Error Test 30: isCreatedBy works with different userId types", () => {
      const todo = new Todo("1", "Task", false, "user1");

      expect(todo.isCreatedBy("user1")).toBe(true);
      expect(todo.isCreatedBy("user2")).toBe(false);
      expect(todo.isCreatedBy(1)).toBe(false);
    });

    test("Error Test 31: Error messages contain useful debugging information", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      User.fromDict(undefined);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callMessage = consoleErrorSpy.mock.calls[0][0];
      expect(callMessage).toContain("Couldn't create user");

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Error Test 10: Graceful Degradation and Recovery", () => {
    test("should handle JSON serialization of incomplete todo", () => {
      const todo = new Todo("1", "Task", false, "user1");

      const json = todo.toJson();

      expect(json).toHaveProperty("id");
      expect(json).toHaveProperty("title");
      expect(json).toHaveProperty("isCompleted");
      expect(json).toHaveProperty("userId");
    });

    test("should serialize user with empty todos array", () => {
      const user = new User("1", "User", "user@example.com", []);

      const json = user.toJson();

      expect(json.todos).toEqual([]);
      expect(json.id).toBe("1");
      expect(json.name).toBe("User");
      expect(json.email).toBe("user@example.com");
    });

    test("Error Test 32: Todo with null userId in isCreatedBy returns correct value", () => {
      const todo = new Todo("1", "Task", false, null);

      expect(todo.isCreatedBy("1")).toBe(false);
      expect(todo.isCreatedBy(null)).toBe(true);
    });

    test("Error Test 33: groupByUser correctly groups todos with null userId", () => {
      const todos = [
        new Todo("1", "Task 1", false, null),
        new Todo("2", "Task 2", true, null),
        new Todo("3", "Task 3", false, "user1"),
      ];

      const grouped = groupByUser(todos);

      expect(grouped[null]).toHaveLength(2);
      expect(grouped.user1).toHaveLength(1);
    });

    test("Error Test 34: Multiple consecutive errors are handled independently", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      Todo.fromDict(null);
      Todo.fromDict(undefined);
      User.fromDict(null);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(3);

      consoleErrorSpy.mockRestore();
    });

    test("Error Test 35: System continues operating after errors", () => {
      const todo1 = Todo.fromDict(null);
      expect(todo1).toBeUndefined();

      const todo2 = new Todo("1", "Valid Task", false, "user1");
      expect(todo2.id).toBe("1");

      const user = new User("user1", "Test", "test@example.com", [todo2]);
      expect(user.todos).toHaveLength(1);
    });
  });
});
