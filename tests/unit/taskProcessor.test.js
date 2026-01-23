import { filterByStatus } from "../../core/taskProcessor.js";
import { Todo, TodoStatus } from "../../core/models.js";

const sampleTodos = [
  new Todo("1", "Buy groceries", false, "user-123"),
  new Todo("2", "Finish project report", true, "user-123"),
  new Todo("3", "Schedule dentist appointment", false, "user-456"),
  new Todo("4", "Review code changes", true, "user-456"),
  new Todo("5", "Update documentation", false, "user-123"),
];

test("filters correctly by pending status", () => {
  const result = filterByStatus(sampleTodos, TodoStatus.PENDING);
  expect(result).toHaveLength(3);
  expect(result[0].id).toBe("1");
  expect(result[1].id).toBe("3");
  expect(result[2].id).toBe("5");
});

test("filters correctly by complete status", () => {
  const result = filterByStatus(sampleTodos, TodoStatus.COMPLETE);
  expect(result).toHaveLength(2);
  expect(result[0].id).toBe("2");
  expect(result[1].id).toBe("4");
});
