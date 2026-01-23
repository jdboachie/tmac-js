import { PriorityTodo, Todo, TodoStatus } from "../../core/models.js";

describe("PriorityTodo Class", () => {
  let priorityTodo;
  let futureDate;

  beforeEach(() => {
    futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    priorityTodo = new PriorityTodo("1", "Priority Task", false, "user-123", 2, futureDate);
  });

  describe("Inheritance from Todo Class", () => {
    test("should be instance of PriorityTodo", () => {
      expect(priorityTodo).toBeInstanceOf(PriorityTodo);
    });

    test("should be instance of Todo", () => {
      expect(priorityTodo).toBeInstanceOf(Todo);
    });

    test("should inherit all Todo properties", () => {
      expect(priorityTodo.id).toBe("1");
      expect(priorityTodo.title).toBe("Priority Task");
      expect(priorityTodo.isCompleted).toBe(false);
      expect(priorityTodo.userId).toBe("user-123");
    });

    test("should inherit toggle method from parent", () => {
      expect(priorityTodo.isCompleted).toBe(false);
      priorityTodo.toggle();
      expect(priorityTodo.isCompleted).toBe(true);
    });

    test("should inherit getStatus method from parent", () => {
      expect(priorityTodo.getStatus()).toBe(TodoStatus.PENDING);
      priorityTodo.toggle();
      expect(priorityTodo.getStatus()).toBe(TodoStatus.COMPLETE);
    });

    test("should inherit toJson method from parent", () => {
      const json = priorityTodo.toJson();
      expect(json).toHaveProperty("id");
      expect(json).toHaveProperty("title");
      expect(json).toHaveProperty("isCompleted");
      expect(json).toHaveProperty("userId");
    });

    test("should inherit isCreatedBy method from parent", () => {
      expect(priorityTodo.isCreatedBy("user-123")).toBe(true);
      expect(priorityTodo.isCreatedBy("user-other")).toBe(false);
    });
  });

  describe("Priority-Specific Properties", () => {
    test("should initialize with priority level", () => {
      const todo = new PriorityTodo("2", "Urgent Task", false, "user-456", 1, futureDate);
      expect(todo).toBeDefined();
    });

    test("should initialize with due date", () => {
      const todo = new PriorityTodo("3", "Deadline Task", false, "user-789", 3, futureDate);
      expect(todo).toBeDefined();
    });

    test("should handle various priority levels", () => {
      const level1 = new PriorityTodo("4", "P1", false, "user-123", 1, futureDate);
      const level3 = new PriorityTodo("5", "P3", false, "user-123", 3, futureDate);
      const level5 = new PriorityTodo("6", "P5", false, "user-123", 5, futureDate);

      expect(level1).toBeDefined();
      expect(level3).toBeDefined();
      expect(level5).toBeDefined();
    });

    test("should accept null due date", () => {
      const todo = new PriorityTodo("7", "No Deadline", false, "user-123", 2, null);
      expect(todo).toBeDefined();
    });

    test("should accept undefined due date", () => {
      const todo = new PriorityTodo("8", "Undefined Date", false, "user-123", 2, undefined);
      expect(todo).toBeDefined();
    });
  });

  describe("isOverDue() Method Override", () => {
    test("should return false when due date is in future", () => {
      expect(priorityTodo.isOverDue()).toBe(false);
    });

    test("should return false when due date is null", () => {
      const nullDateTodo = new PriorityTodo("9", "Null Date", false, "user-123", 2, null);
      expect(nullDateTodo.isOverDue()).toBe(false);
    });

    test("should return false when due date is undefined", () => {
      const undefinedDateTodo = new PriorityTodo("10", "Undefined Date", false, "user-123", 2, undefined);
      expect(undefinedDateTodo.isOverDue()).toBe(false);
    });

    test("should return false when task is completed", () => {
      const completedTodo = new PriorityTodo("11", "Completed", true, "user-123", 2, futureDate);
      expect(completedTodo.isOverDue()).toBe(false);
    });

    test("should handle date comparison correctly", () => {
      const todo = new PriorityTodo("12", "Date Test", false, "user-123", 2, futureDate);
      expect(todo.isOverDue()).toBe(false);
    });

    test("should return false for pending tasks with future dates", () => {
      const pending = new PriorityTodo("13", "Pending", false, "user-123", 2, futureDate);
      expect(pending.getStatus()).toBe(TodoStatus.PENDING);
      expect(pending.isOverDue()).toBe(false);
    });
  });

  describe("Priority Level Validation", () => {
    test("should accept priority level 0", () => {
      const todo = new PriorityTodo("14", "P0", false, "user-123", 0, futureDate);
      expect(todo).toBeDefined();
    });

    test("should accept positive priority levels", () => {
      const todo = new PriorityTodo("15", "High", false, "user-123", 100, futureDate);
      expect(todo).toBeDefined();
    });

    test("should accept negative priority levels", () => {
      const todo = new PriorityTodo("16", "Negative", false, "user-123", -5, futureDate);
      expect(todo).toBeDefined();
    });

    test("should accept non-numeric priority values", () => {
      const todo = new PriorityTodo("17", "String Priority", false, "user-123", "high", futureDate);
      expect(todo).toBeDefined();
    });

    test("should accept null priority", () => {
      const todo = new PriorityTodo("18", "Null Priority", false, "user-123", null, futureDate);
      expect(todo).toBeDefined();
    });
  });

  describe("Inherited Methods Work Correctly", () => {
    test("should toggle completion status correctly", () => {
      expect(priorityTodo.isCompleted).toBe(false);
      priorityTodo.toggle();
      expect(priorityTodo.isCompleted).toBe(true);
      priorityTodo.toggle();
      expect(priorityTodo.isCompleted).toBe(false);
    });

    test("should serialize to JSON properly", () => {
      const json = priorityTodo.toJson();
      expect(json).toEqual({
        id: "1",
        title: "Priority Task",
        isCompleted: false,
        userId: "user-123",
      });
    });

    test("should identify creator correctly", () => {
      expect(priorityTodo.isCreatedBy("user-123")).toBe(true);
      expect(priorityTodo.isCreatedBy("user-456")).toBe(false);
    });

    test("should return correct status after toggle", () => {
      expect(priorityTodo.getStatus()).toBe(TodoStatus.PENDING);
      priorityTodo.toggle();
      expect(priorityTodo.getStatus()).toBe(TodoStatus.COMPLETE);
      priorityTodo.toggle();
      expect(priorityTodo.getStatus()).toBe(TodoStatus.PENDING);
    });
  });

  describe("Integration with Parent Class Methods", () => {
    test("should chain parent methods with priority overrides", () => {
      expect(priorityTodo.isCreatedBy("user-123")).toBe(true);
      expect(priorityTodo.getStatus()).toBe(TodoStatus.PENDING);
      expect(priorityTodo.isOverDue()).toBe(false);

      priorityTodo.toggle();

      expect(priorityTodo.getStatus()).toBe(TodoStatus.COMPLETE);
      expect(priorityTodo.isOverDue()).toBe(false);
    });

    test("should maintain parent behavior across multiple operations", () => {
      const todo = new PriorityTodo("19", "Multi Op", false, "user-123", 3, futureDate);

      expect(todo.getStatus()).toBe(TodoStatus.PENDING);
      expect(todo.isCreatedBy("user-123")).toBe(true);
      expect(todo.isOverDue()).toBe(false);

      todo.toggle();

      const json = todo.toJson();
      expect(json.isCompleted).toBe(true);
      expect(todo.isOverDue()).toBe(false);
    });

    test("should reflect state changes in all methods", () => {
      priorityTodo.toggle();
      const json = priorityTodo.toJson();
      expect(json.isCompleted).toBe(true);
      expect(priorityTodo.getStatus()).toBe(TodoStatus.COMPLETE);
    });
  });

  describe("Date Handling", () => {
    test("should handle far future dates", () => {
      const farFuture = new Date();
      farFuture.setFullYear(farFuture.getFullYear() + 10);
      const todo = new PriorityTodo("20", "Far Future", false, "user-123", 2, farFuture);
      expect(todo).toBeDefined();
      expect(todo.isOverDue()).toBe(false);
    });

    test("should handle Date object construction", () => {
      const specificDate = new Date("2025-12-31T23:59:59Z");
      const todo = new PriorityTodo("21", "Specific Date", false, "user-123", 2, specificDate);
      expect(todo).toBeDefined();
    });

    test("should maintain due date through operations", () => {
      const todo = new PriorityTodo("22", "Date Persistence", false, "user-123", 2, futureDate);
      todo.toggle();
      todo.toggle();
      expect(todo.isCompleted).toBe(false);
      expect(todo.isOverDue()).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty string title", () => {
      const todo = new PriorityTodo("23", "", false, "user-123", 2, futureDate);
      expect(todo.title).toBe("");
    });

    test("should handle null id", () => {
      const todo = new PriorityTodo(null, "Task", false, "user-123", 2, futureDate);
      expect(todo.id).toBeNull();
    });

    test("should handle all properties as null", () => {
      const todo = new PriorityTodo(null, null, false, null, null, null);
      expect(todo).toBeDefined();
    });

    test("should initialize with all parameters set correctly", () => {
      const completeTodo = new PriorityTodo("24", "Complete Task", true, "user-complete", 3, futureDate);
      expect(completeTodo.id).toBe("24");
      expect(completeTodo.title).toBe("Complete Task");
      expect(completeTodo.isCompleted).toBe(true);
      expect(completeTodo.userId).toBe("user-complete");
    });
  });
});
