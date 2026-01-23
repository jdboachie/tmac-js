import { Todo, TodoStatus } from "../../core/models.js";

describe("Todo Class", () => {
  let todo;

  beforeEach(() => {
    todo = new Todo("1", "Test Task", false, "user-123");
  });

  describe("Constructor", () => {
    test("should initialize Todo with all properties correctly", () => {
      expect(todo.id).toBe("1");
      expect(todo.title).toBe("Test Task");
      expect(todo.isCompleted).toBe(false);
      expect(todo.userId).toBe("user-123");
    });

    test("should handle empty string values", () => {
      const emptyTodo = new Todo("", "", false, "");
      expect(emptyTodo.id).toBe("");
      expect(emptyTodo.title).toBe("");
      expect(emptyTodo.userId).toBe("");
    });

    test("should handle completed todo initialization", () => {
      const completedTodo = new Todo("2", "Completed Task", true, "user-456");
      expect(completedTodo.isCompleted).toBe(true);
    });
  });

  describe("toggle() method", () => {
    test("should toggle isCompleted from false to true", () => {
      expect(todo.isCompleted).toBe(false);
      todo.toggle();
      expect(todo.isCompleted).toBe(true);
    });

    test("should toggle isCompleted from true to false", () => {
      todo.isCompleted = true;
      todo.toggle();
      expect(todo.isCompleted).toBe(false);
    });

    test("should toggle multiple times correctly", () => {
      todo.isCompleted = false;
      expect(todo.isCompleted).toBe(false);
      todo.toggle();
      expect(todo.isCompleted).toBe(true);
      todo.toggle();
      expect(todo.isCompleted).toBe(false);
      todo.toggle();
      expect(todo.isCompleted).toBe(true);
    });
  });

  describe("getStatus() method", () => {
    test("should return PENDING status when isCompleted is false", () => {
      todo.isCompleted = false;
      expect(todo.getStatus()).toBe(TodoStatus.PENDING);
    });

    test("should return COMPLETE status when isCompleted is true", () => {
      todo.isCompleted = true;
      expect(todo.getStatus()).toBe(TodoStatus.COMPLETE);
    });

    test("should return correct status after toggling", () => {
      expect(todo.getStatus()).toBe(TodoStatus.PENDING);
      todo.toggle();
      expect(todo.getStatus()).toBe(TodoStatus.COMPLETE);
    });
  });

  describe("isOverDue() method", () => {
    test("should always return false for base Todo class", () => {
      expect(todo.isOverDue()).toBe(false);
    });

    test("should return false when completed", () => {
      todo.isCompleted = true;
      expect(todo.isOverDue()).toBe(false);
    });

    test("should return false when pending", () => {
      todo.isCompleted = false;
      expect(todo.isOverDue()).toBe(false);
    });
  });

  describe("isCreatedBy() method", () => {
    test("should return true when userId matches", () => {
      expect(todo.isCreatedBy("user-123")).toBe(true);
    });

    test("should return false when userId does not match", () => {
      expect(todo.isCreatedBy("user-456")).toBe(false);
    });

    test("should return false with empty string userId", () => {
      expect(todo.isCreatedBy("")).toBe(false);
    });
  });

  describe("toJson() method", () => {
    test("should serialize Todo object to JSON correctly", () => {
      const json = todo.toJson();
      expect(json).toEqual({
        id: "1",
        title: "Test Task",
        isCompleted: false,
        userId: "user-123",
      });
    });

    test("should serialize completed todo to JSON", () => {
      todo.isCompleted = true;
      const json = todo.toJson();
      expect(json.isCompleted).toBe(true);
    });

    test("should not modify original todo when serializing", () => {
      const originalCompleted = todo.isCompleted;
      todo.toJson();
      expect(todo.isCompleted).toBe(originalCompleted);
    });
  });

  describe("fromDict() static method", () => {
    test("should create Todo from dictionary object", () => {
      const dict = {
        id: "10",
        title: "From Dict Task",
        completed: true,
        userId: "user-789",
      };
      const newTodo = Todo.fromDict(dict);
      expect(newTodo.id).toBe("10");
      expect(newTodo.title).toBe("From Dict Task");
      expect(newTodo.isCompleted).toBe(true);
      expect(newTodo.userId).toBe("user-789");
    });

    test("should convert completed property to boolean", () => {
      const dict = {
        id: "11",
        title: "Boolean Test",
        completed: 1,
        userId: "user-001",
      };
      const newTodo = Todo.fromDict(dict);
      expect(typeof newTodo.isCompleted).toBe("boolean");
      expect(newTodo.isCompleted).toBe(true);
    });

    test("should handle falsy completed values", () => {
      const dict = {
        id: "12",
        title: "Falsy Test",
        completed: 0,
        userId: "user-002",
      };
      const newTodo = Todo.fromDict(dict);
      expect(newTodo.isCompleted).toBe(false);
    });

    test("should handle missing properties gracefully", () => {
      const dict = {
        id: "13",
        title: "Incomplete Dict",
      };
      const newTodo = Todo.fromDict(dict);
      expect(newTodo.userId).toBeUndefined();
    });

    test("should return undefined on error", () => {
      const result = Todo.fromDict(null);
      expect(result).toBeUndefined();
    });
  });

  describe("Edge cases and error conditions", () => {
    test("should handle null title gracefully", () => {
      const nullTitleTodo = new Todo("1", null, false, "user-123");
      expect(nullTitleTodo.title).toBeNull();
    });

    test("should handle undefined userId", () => {
      const undefinedUserTodo = new Todo("1", "Task", false, undefined);
      expect(undefinedUserTodo.userId).toBeUndefined();
    });

    test("should handle special characters in title", () => {
      const specialTodo = new Todo("1", "Task @#$%^&*()", false, "user-123");
      expect(specialTodo.title).toBe("Task @#$%^&*()");
    });

    test("should handle very long title strings", () => {
      const longTitle = "a".repeat(1000);
      const longTodo = new Todo("1", longTitle, false, "user-123");
      expect(longTodo.title.length).toBe(1000);
    });

    test("should handle numeric-like string ids", () => {
      const numericIdTodo = new Todo("12345", "Task", false, "user-123");
      expect(numericIdTodo.id).toBe("12345");
      expect(typeof numericIdTodo.id).toBe("string");
    });
  });
});
