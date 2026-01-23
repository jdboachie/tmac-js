import { User, Todo, TodoStatus } from "../../core/models.js";

describe("User Class", () => {
  let user;
  let todo1;
  let todo2;
  let todo3;

  beforeEach(() => {
    user = new User("user-1", "John Doe", "john@example.com", []);
    todo1 = new Todo("1", "Task 1", false, "user-1");
    todo2 = new Todo("2", "Task 2", true, "user-1");
    todo3 = new Todo("3", "Task 3", false, "user-1");
  });

  describe("Constructor", () => {
    test("should initialize with all properties", () => {
      expect(user.id).toBe("user-1");
      expect(user.name).toBe("John Doe");
      expect(user.email).toBe("john@example.com");
      expect(user.todos).toEqual([]);
    });

    test("should initialize with provided todos array", () => {
      const initialTodos = [todo1, todo2];
      const userWithTodos = new User(
        "user-2",
        "Jane Doe",
        "jane@example.com",
        initialTodos,
      );
      expect(userWithTodos.todos).toEqual(initialTodos);
      expect(userWithTodos.todos.length).toBe(2);
    });

    test("should handle null todos array", () => {
      expect(user.todos).toBeDefined();
      expect(Array.isArray(user.todos)).toBe(true);
    });

    test("should handle empty name and email", () => {
      const emptyUser = new User("id", "", "", []);
      expect(emptyUser.name).toBe("");
      expect(emptyUser.email).toBe("");
    });
  });

  describe("addTodo() Method", () => {
    test("should add a single todo to empty array", () => {
      expect(user.todos.length).toBe(0);
      user.addTodo(todo1);
      expect(user.todos.length).toBe(1);
      expect(user.todos[0]).toBe(todo1);
    });

    test("should add multiple todos", () => {
      user.addTodo(todo1);
      user.addTodo(todo2);
      user.addTodo(todo3);
      expect(user.todos.length).toBe(3);
      expect(user.todos[0]).toBe(todo1);
      expect(user.todos[1]).toBe(todo2);
      expect(user.todos[2]).toBe(todo3);
    });

    test("should add completed and pending todos", () => {
      user.addTodo(todo1);
      user.addTodo(todo2);
      expect(user.todos.length).toBe(2);
      expect(user.todos[0].isCompleted).toBe(false);
      expect(user.todos[1].isCompleted).toBe(true);
    });

    test("should preserve order of added todos", () => {
      user.addTodo(todo3);
      user.addTodo(todo1);
      user.addTodo(todo2);
      expect(user.todos[0]).toBe(todo3);
      expect(user.todos[1]).toBe(todo1);
      expect(user.todos[2]).toBe(todo2);
    });

    test("should handle adding same todo multiple times", () => {
      user.addTodo(todo1);
      user.addTodo(todo1);
      expect(user.todos.length).toBe(2);
      expect(user.todos[0]).toBe(todo1);
      expect(user.todos[1]).toBe(todo1);
    });
  });

  describe("getCompletionRate() Method", () => {
    test("should return 0 for empty todos array", () => {
      expect(user.getCompletionRate()).toBe(0);
    });

    test("should return 0 when no todos are completed", () => {
      user.addTodo(todo1);
      user.addTodo(todo3);
      expect(user.getCompletionRate()).toBe(0);
    });

    test("should return 1 when all todos are completed", () => {
      const completedTodo1 = new Todo("1", "Task 1", true, "user-1");
      const completedTodo2 = new Todo("2", "Task 2", true, "user-1");
      user.addTodo(completedTodo1);
      user.addTodo(completedTodo2);
      expect(user.getCompletionRate()).toBe(1);
    });

    test("should return 0.5 for 50% completion", () => {
      user.addTodo(todo1);
      user.addTodo(todo2);
      expect(user.getCompletionRate()).toBe(0.5);
    });

    test("should return correct rate for mixed tasks", () => {
      const completed1 = new Todo("1", "Task 1", true, "user-1");
      const completed2 = new Todo("2", "Task 2", true, "user-1");
      const pending1 = new Todo("3", "Task 3", false, "user-1");
      user.addTodo(completed1);
      user.addTodo(completed2);
      user.addTodo(pending1);
      expect(user.getCompletionRate()).toBe(2 / 3);
    });

    test("should return 1 for single completed todo", () => {
      const completed = new Todo("1", "Task 1", true, "user-1");
      user.addTodo(completed);
      expect(user.getCompletionRate()).toBe(1);
    });

    test("should handle decimal completion rates", () => {
      const todos = Array.from(
        { length: 10 },
        (_, i) => new Todo(`${i}`, `Task ${i}`, i < 3, "user-1"),
      );
      todos.forEach((t) => user.addTodo(t));
      expect(user.getCompletionRate()).toBe(0.3);
    });
  });

  describe("getTodosByStatus() Method", () => {
    test("should return empty array for empty todos", () => {
      const pending = user.getTodosByStatus(TodoStatus.PENDING);
      expect(pending).toEqual([]);
    });

    test("should filter todos by pending status", () => {
      user.addTodo(todo1);
      user.addTodo(todo2);
      user.addTodo(todo3);
      const pending = user.getTodosByStatus(TodoStatus.PENDING);
      expect(pending.length).toBe(2);
      expect(pending[0]).toBe(todo1);
      expect(pending[1]).toBe(todo3);
    });

    test("should filter todos by complete status", () => {
      user.addTodo(todo1);
      user.addTodo(todo2);
      user.addTodo(todo3);
      const completed = user.getTodosByStatus(TodoStatus.COMPLETE);
      expect(completed.length).toBe(1);
      expect(completed[0]).toBe(todo2);
    });

    test("should return all todos when all match status", () => {
      const completed1 = new Todo("1", "Task 1", true, "user-1");
      const completed2 = new Todo("2", "Task 2", true, "user-1");
      user.addTodo(completed1);
      user.addTodo(completed2);
      const completed = user.getTodosByStatus(TodoStatus.COMPLETE);
      expect(completed.length).toBe(2);
    });

    test("should return empty array when no todos match status", () => {
      user.addTodo(todo1);
      user.addTodo(todo3);
      const completed = user.getTodosByStatus(TodoStatus.COMPLETE);
      expect(completed.length).toBe(0);
    });

    test("should preserve order of filtered todos", () => {
      const pending1 = new Todo("1", "Task 1", false, "user-1");
      const pending2 = new Todo("2", "Task 2", false, "user-1");
      const completed = new Todo("3", "Task 3", true, "user-1");
      user.addTodo(pending1);
      user.addTodo(completed);
      user.addTodo(pending2);
      const pending = user.getTodosByStatus(TodoStatus.PENDING);
      expect(pending[0]).toBe(pending1);
      expect(pending[1]).toBe(pending2);
    });

    test("should handle filtering after adding and removing todos", () => {
      user.addTodo(todo1);
      user.addTodo(todo2);
      user.addTodo(todo3);
      let pending = user.getTodosByStatus(TodoStatus.PENDING);
      expect(pending.length).toBe(2);
      todo1.toggle();
      pending = user.getTodosByStatus(TodoStatus.PENDING);
      expect(pending.length).toBe(1);
    });
  });

  describe("fromDict() Static Method", () => {
    test("should create User from dictionary", () => {
      const dict = {
        id: "user-3",
        name: "Alice",
        email: "alice@example.com",
        todos: [todo1, todo2],
      };
      const createdUser = User.fromDict(dict);
      expect(createdUser.id).toBe("user-3");
      expect(createdUser.name).toBe("Alice");
      expect(createdUser.email).toBe("alice@example.com");
      expect(createdUser.todos).toEqual([todo1, todo2]);
    });

    test("should handle missing todos property", () => {
      const dict = {
        id: "user-4",
        name: "Bob",
        email: "bob@example.com",
      };
      const createdUser = User.fromDict(dict);
      expect(createdUser.todos).toEqual([]);
    });

    test("should return undefined on error", () => {
      const result = User.fromDict(null);
      expect(result).toBeUndefined();
    });

    test("should handle empty todos in dictionary", () => {
      const dict = {
        id: "user-5",
        name: "Charlie",
        email: "charlie@example.com",
        todos: [],
      };
      const createdUser = User.fromDict(dict);
      expect(createdUser.todos.length).toBe(0);
    });
  });

  describe("toJson() Method", () => {
    test("should serialize user to JSON", () => {
      user.addTodo(todo1);
      const json = user.toJson();
      expect(json.id).toBe("user-1");
      expect(json.name).toBe("John Doe");
      expect(json.email).toBe("john@example.com");
      expect(json.todos.length).toBe(1);
    });

    test("should include empty todos array in JSON", () => {
      const json = user.toJson();
      expect(json.todos).toEqual([]);
    });

    test("should serialize todos array correctly", () => {
      user.addTodo(todo1);
      user.addTodo(todo2);
      const json = user.toJson();
      expect(json.todos.length).toBe(2);
      expect(json.todos[0]).toBe(todo1);
      expect(json.todos[1]).toBe(todo2);
    });

    test("should not modify original user when serializing", () => {
      user.addTodo(todo1);
      const originalTodosLength = user.todos.length;
      user.toJson();
      expect(user.todos.length).toBe(originalTodosLength);
    });
  });

  describe("Edge Cases", () => {
    test("should handle division by zero in completion rate", () => {
      expect(user.getCompletionRate()).toBe(0);
    });

    test("should handle large number of todos", () => {
      const todos = Array.from(
        { length: 1000 },
        (_, i) => new Todo(`${i}`, `Task ${i}`, i % 2 === 0, "user-1"),
      );
      todos.forEach((t) => user.addTodo(t));
      expect(user.todos.length).toBe(1000);
      expect(user.getCompletionRate()).toBe(0.5);
    });

    test("should handle null in todos array", () => {
      user.todos = [todo1, null, todo2];
      expect(user.todos.length).toBe(3);
    });

    test("should handle todos with same properties", () => {
      const duplicate1 = new Todo("1", "Same Task", false, "user-1");
      const duplicate2 = new Todo("1", "Same Task", false, "user-1");
      user.addTodo(duplicate1);
      user.addTodo(duplicate2);
      expect(user.todos.length).toBe(2);
      expect(user.todos[0].id).toBe(user.todos[1].id);
    });

    test("should handle special characters in name and email", () => {
      const specialUser = new User(
        "id",
        "José García",
        "test+tag@example.com",
        [],
      );
      expect(specialUser.name).toBe("José García");
      expect(specialUser.email).toBe("test+tag@example.com");
    });

    test("should handle very long name and email", () => {
      const longName = "A".repeat(1000);
      const longEmail = "test" + "b".repeat(500) + "@example.com";
      const longUser = new User("id", longName, longEmail, []);
      expect(longUser.name.length).toBe(1000);
      expect(longUser.email.length).toBe(longEmail.length);
    });

    test("should maintain completion rate after toggling todos", () => {
      user.addTodo(todo1);
      user.addTodo(todo2);
      expect(user.getCompletionRate()).toBe(0.5);
      todo1.toggle();
      expect(user.getCompletionRate()).toBe(1);
      todo1.toggle();
      expect(user.getCompletionRate()).toBe(0.5);
    });
  });

  describe("Integration Scenarios", () => {
    test("should handle complete user workflow", () => {
      user.addTodo(todo1);
      user.addTodo(todo2);
      user.addTodo(todo3);

      expect(user.todos.length).toBe(3);
      expect(user.getCompletionRate()).toBe(1 / 3);

      const pending = user.getTodosByStatus(TodoStatus.PENDING);
      expect(pending.length).toBe(2);

      todo1.toggle();
      expect(user.getCompletionRate()).toBe(2 / 3);
    });

    test("should handle multiple users independently", () => {
      const user2 = new User("user-2", "Jane", "jane@example.com", []);
      const todo4 = new Todo("4", "Task 4", false, "user-2");

      user.addTodo(todo1);
      user2.addTodo(todo4);

      expect(user.todos.length).toBe(1);
      expect(user2.todos.length).toBe(1);
      expect(user.getCompletionRate()).toBe(0);
      expect(user2.getCompletionRate()).toBe(0);
    });

    test("should handle JSON serialization and deserialization", () => {
      user.addTodo(todo1);
      user.addTodo(todo2);
      const json = user.toJson();

      const newUser = new User(json.id, json.name, json.email, json.todos);
      expect(newUser.id).toBe(user.id);
      expect(newUser.name).toBe(user.name);
      expect(newUser.email).toBe(user.email);
      expect(newUser.todos.length).toBe(user.todos.length);
    });

    test("should handle adding todos and filtering by status simultaneously", () => {
      const completedTodos = Array.from(
        { length: 5 },
        (_, i) => new Todo(`c${i}`, `Completed ${i}`, true, "user-1"),
      );
      const pendingTodos = Array.from(
        { length: 3 },
        (_, i) => new Todo(`p${i}`, `Pending ${i}`, false, "user-1"),
      );

      completedTodos.forEach((t) => user.addTodo(t));
      pendingTodos.forEach((t) => user.addTodo(t));

      expect(user.getCompletionRate()).toBe(5 / 8);
      expect(user.getTodosByStatus(TodoStatus.COMPLETE).length).toBe(5);
      expect(user.getTodosByStatus(TodoStatus.PENDING).length).toBe(3);
    });
  });
});
