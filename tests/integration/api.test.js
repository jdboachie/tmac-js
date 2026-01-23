import mockApi from "../__mocks__/api.js";

describe("Mock API Integration Tests", () => {
  beforeEach(() => {
    mockApi.resetMockData();
  });

  describe("fetchAllUsers()", () => {
    test("should fetch all users successfully", async () => {
      const users = await mockApi.fetchAllUsers();
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    test("should return users with correct structure", async () => {
      const users = await mockApi.fetchAllUsers();
      const user = users[0];
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("todos");
    });

    test("should return array of users", async () => {
      const users = await mockApi.fetchAllUsers();
      expect(users.length).toBe(3);
      expect(users[0].id).toBe("user-1");
      expect(users[1].id).toBe("user-2");
      expect(users[2].id).toBe("user-3");
    });

    test("should include todos for each user", async () => {
      const users = await mockApi.fetchAllUsers();
      expect(users[0].todos.length).toBeGreaterThan(0);
      expect(Array.isArray(users[0].todos)).toBe(true);
    });
  });

  describe("fetchUserById()", () => {
    test("should fetch user by valid id", async () => {
      const user = await mockApi.fetchUserById("user-1");
      expect(user.id).toBe("user-1");
      expect(user.name).toBe("John Doe");
      expect(user.email).toBe("john@example.com");
    });

    test("should return user with todos", async () => {
      const user = await mockApi.fetchUserById("user-1");
      expect(user.todos).toBeDefined();
      expect(Array.isArray(user.todos)).toBe(true);
    });

    test("should reject when user not found", async () => {
      try {
        await mockApi.fetchUserById("invalid-id");
        fail("Should have thrown error");
      } catch (error) {
        expect(error.message).toContain("not found");
      }
    });

    test("should handle different user ids", async () => {
      const user1 = await mockApi.fetchUserById("user-1");
      const user2 = await mockApi.fetchUserById("user-2");
      expect(user1.id).not.toBe(user2.id);
      expect(user1.name).not.toBe(user2.name);
    });
  });

  describe("fetchAllTodos()", () => {
    test("should fetch all todos successfully", async () => {
      const todos = await mockApi.fetchAllTodos();
      expect(todos).toBeDefined();
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBeGreaterThan(0);
    });

    test("should return todos with correct structure", async () => {
      const todos = await mockApi.fetchAllTodos();
      const todo = todos[0];
      expect(todo).toHaveProperty("id");
      expect(todo).toHaveProperty("title");
      expect(todo).toHaveProperty("completed");
      expect(todo).toHaveProperty("userId");
    });

    test("should return all todos", async () => {
      const todos = await mockApi.fetchAllTodos();
      expect(todos.length).toBe(6);
    });

    test("should include both completed and incomplete todos", async () => {
      const todos = await mockApi.fetchAllTodos();
      const completed = todos.filter((t) => t.completed);
      const incomplete = todos.filter((t) => !t.completed);
      expect(completed.length).toBeGreaterThan(0);
      expect(incomplete.length).toBeGreaterThan(0);
    });
  });

  describe("fetchTodosByUserId()", () => {
    test("should fetch todos for valid user", async () => {
      const todos = await mockApi.fetchTodosByUserId("user-1");
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBeGreaterThan(0);
    });

    test("should return only todos for specified user", async () => {
      const todos = await mockApi.fetchTodosByUserId("user-1");
      todos.forEach((todo) => {
        expect(todo.userId).toBe("user-1");
      });
    });

    test("should return empty array for user with no todos", async () => {
      const todos = await mockApi.fetchTodosByUserId("user-3");
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBe(0);
    });

    test("should reject when user not found", async () => {
      try {
        await mockApi.fetchTodosByUserId("invalid-user");
        fail("Should have thrown error");
      } catch (error) {
        expect(error.message).toContain("not found");
      }
    });

    test("should return different todos for different users", async () => {
      const todos1 = await mockApi.fetchTodosByUserId("user-1");
      const todos2 = await mockApi.fetchTodosByUserId("user-2");
      expect(todos1.length).not.toBe(todos2.length);
    });
  });

  describe("fetchTodoById()", () => {
    test("should fetch todo by valid id", async () => {
      const todo = await mockApi.fetchTodoById("todo-1");
      expect(todo.id).toBe("todo-1");
      expect(todo.title).toBe("Buy groceries");
    });

    test("should return todo with all properties", async () => {
      const todo = await mockApi.fetchTodoById("todo-1");
      expect(todo).toHaveProperty("id");
      expect(todo).toHaveProperty("title");
      expect(todo).toHaveProperty("completed");
      expect(todo).toHaveProperty("userId");
    });

    test("should reject when todo not found", async () => {
      try {
        await mockApi.fetchTodoById("invalid-todo");
        fail("Should have thrown error");
      } catch (error) {
        expect(error.message).toContain("not found");
      }
    });

    test("should distinguish between completed and incomplete todos", async () => {
      const completedTodo = await mockApi.fetchTodoById("todo-2");
      const incompleteTodo = await mockApi.fetchTodoById("todo-1");
      expect(completedTodo.completed).toBe(true);
      expect(incompleteTodo.completed).toBe(false);
    });
  });

  describe("createTodo()", () => {
    test("should create new todo successfully", async () => {
      const newTodo = await mockApi.createTodo("user-1", "New Task", false);
      expect(newTodo).toBeDefined();
      expect(newTodo.title).toBe("New Task");
      expect(newTodo.userId).toBe("user-1");
      expect(newTodo.completed).toBe(false);
    });

    test("should add created todo to todos list", async () => {
      const todosBefore = await mockApi.fetchAllTodos();
      const lengthBefore = todosBefore.length;
      await mockApi.createTodo("user-1", "New Task", false);
      const todosAfter = await mockApi.fetchAllTodos();
      expect(todosAfter.length).toBe(lengthBefore + 1);
    });

    test("should add created todo to user's todos", async () => {
      const todoBefore = await mockApi.fetchTodosByUserId("user-1");
      const lengthBefore = todoBefore.length;
      await mockApi.createTodo("user-1", "User Task", false);
      const todoAfter = await mockApi.fetchTodosByUserId("user-1");
      expect(todoAfter.length).toBe(lengthBefore + 1);
    });

    test("should create completed todo", async () => {
      const completedTodo = await mockApi.createTodo(
        "user-2",
        "Completed Task",
        true,
      );
      expect(completedTodo.completed).toBe(true);
    });

    test("should generate unique todo ids", async () => {
      const todo1 = await mockApi.createTodo("user-1", "Task 1", false);
      await new Promise((resolve) => setTimeout(resolve, 5));
      const todo2 = await mockApi.createTodo("user-1", "Task 2", false);
      expect(todo1.id).not.toBe(todo2.id);
    });
  });

  describe("updateTodo()", () => {
    test("should update todo successfully", async () => {
      const updated = await mockApi.updateTodo("todo-1", {
        title: "Updated Title",
      });
      expect(updated.title).toBe("Updated Title");
      expect(updated.id).toBe("todo-1");
    });

    test("should update todo completion status", async () => {
      const updated = await mockApi.updateTodo("todo-1", { completed: true });
      expect(updated.completed).toBe(true);
    });

    test("should reject when todo not found", async () => {
      try {
        await mockApi.updateTodo("invalid-id", { title: "New Title" });
        fail("Should have thrown error");
      } catch (error) {
        expect(error.message).toContain("not found");
      }
    });

    test("should persist updates in todos list", async () => {
      await mockApi.updateTodo("todo-1", { title: "Persisted Title" });
      const todo = await mockApi.fetchTodoById("todo-1");
      expect(todo.title).toBe("Persisted Title");
    });

    test("should handle multiple updates", async () => {
      await mockApi.updateTodo("todo-1", { title: "First Update" });
      const firstUpdate = await mockApi.fetchTodoById("todo-1");
      expect(firstUpdate.title).toBe("First Update");

      await mockApi.updateTodo("todo-1", { title: "Second Update" });
      const secondUpdate = await mockApi.fetchTodoById("todo-1");
      expect(secondUpdate.title).toBe("Second Update");
    });
  });

  describe("deleteTodo()", () => {
    test("should delete todo successfully", async () => {
      const deleted = await mockApi.deleteTodo("todo-1");
      expect(deleted.id).toBe("todo-1");
    });

    test("should remove deleted todo from todos list", async () => {
      const todosBefore = await mockApi.fetchAllTodos();
      const lengthBefore = todosBefore.length;
      await mockApi.deleteTodo("todo-1");
      const todosAfter = await mockApi.fetchAllTodos();
      expect(todosAfter.length).toBe(lengthBefore - 1);
    });

    test("should remove deleted todo from user's todos", async () => {
      const todosBefore = await mockApi.fetchTodosByUserId("user-1");
      const lengthBefore = todosBefore.length;
      await mockApi.deleteTodo("todo-1");
      const todosAfter = await mockApi.fetchTodosByUserId("user-1");
      expect(todosAfter.length).toBe(lengthBefore - 1);
    });

    test("should reject when todo not found", async () => {
      try {
        await mockApi.deleteTodo("invalid-id");
        fail("Should have thrown error");
      } catch (error) {
        expect(error.message).toContain("not found");
      }
    });

    test("should not affect other todos", async () => {
      const todoBefore = await mockApi.fetchTodoById("todo-2");
      await mockApi.deleteTodo("todo-1");
      const todoAfter = await mockApi.fetchTodoById("todo-2");
      expect(todoAfter.id).toBe(todoBefore.id);
      expect(todoAfter.title).toBe(todoBefore.title);
    });
  });

  describe("createUser()", () => {
    test("should create new user successfully", async () => {
      const newUser = await mockApi.createUser("New User", "new@example.com");
      expect(newUser).toBeDefined();
      expect(newUser.name).toBe("New User");
      expect(newUser.email).toBe("new@example.com");
      expect(newUser.todos).toEqual([]);
    });

    test("should add created user to users list", async () => {
      const usersBefore = await mockApi.fetchAllUsers();
      const lengthBefore = usersBefore.length;
      await mockApi.createUser("Another User", "another@example.com");
      const usersAfter = await mockApi.fetchAllUsers();
      expect(usersAfter.length).toBe(lengthBefore + 1);
    });

    test("should initialize new user with empty todos", async () => {
      const newUser = await mockApi.createUser(
        "Empty User",
        "empty@example.com",
      );
      expect(Array.isArray(newUser.todos)).toBe(true);
      expect(newUser.todos.length).toBe(0);
    });

    test("should generate unique user ids", async () => {
      const user1 = await mockApi.createUser("User 1", "user1@example.com");
      await new Promise((resolve) => setTimeout(resolve, 5));
      const user2 = await mockApi.createUser("User 2", "user2@example.com");
      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe("updateUser()", () => {
    test("should update user successfully", async () => {
      const updated = await mockApi.updateUser("user-1", {
        name: "Updated Name",
      });
      expect(updated.name).toBe("Updated Name");
      expect(updated.id).toBe("user-1");
    });

    test("should update user email", async () => {
      const updated = await mockApi.updateUser("user-1", {
        email: "newemail@example.com",
      });
      expect(updated.email).toBe("newemail@example.com");
    });

    test("should reject when user not found", async () => {
      try {
        await mockApi.updateUser("invalid-id", { name: "New Name" });
        fail("Should have thrown error");
      } catch (error) {
        expect(error.message).toContain("not found");
      }
    });

    test("should persist updates in users list", async () => {
      await mockApi.updateUser("user-1", { name: "Persisted Name" });
      const user = await mockApi.fetchUserById("user-1");
      expect(user.name).toBe("Persisted Name");
    });
  });

  describe("deleteUser()", () => {
    test("should delete user successfully", async () => {
      const deleted = await mockApi.deleteUser("user-3");
      expect(deleted.id).toBe("user-3");
    });

    test("should remove deleted user from users list", async () => {
      const usersBefore = await mockApi.fetchAllUsers();
      const lengthBefore = usersBefore.length;
      await mockApi.deleteUser("user-3");
      const usersAfter = await mockApi.fetchAllUsers();
      expect(usersAfter.length).toBe(lengthBefore - 1);
    });

    test("should remove user's todos when user is deleted", async () => {
      const user = await mockApi.fetchUserById("user-1");
      const userTodosCount = user.todos.length;
      const todosBefore = await mockApi.fetchAllTodos();
      const lengthBefore = todosBefore.length;

      await mockApi.deleteUser("user-1");

      const todosAfter = await mockApi.fetchAllTodos();
      expect(todosAfter.length).toBe(lengthBefore - userTodosCount);
    });

    test("should reject when user not found", async () => {
      try {
        await mockApi.deleteUser("invalid-id");
        fail("Should have thrown error");
      } catch (error) {
        expect(error.message).toContain("not found");
      }
    });
  });

  describe("resetMockData()", () => {
    test("should reset users to initial state", async () => {
      await mockApi.createUser("Test User", "test@example.com");
      mockApi.resetMockData();
      const users = await mockApi.fetchAllUsers();
      expect(users.length).toBe(3);
      expect(users[0].id).toBe("user-1");
    });

    test("should reset todos to initial state", async () => {
      await mockApi.createTodo("user-1", "Test Todo", false);
      mockApi.resetMockData();
      const todos = await mockApi.fetchAllTodos();
      expect(todos.length).toBe(6);
    });

    test("should restore deleted data", async () => {
      await mockApi.deleteUser("user-3");
      mockApi.resetMockData();
      const user = await mockApi.fetchUserById("user-3");
      expect(user.id).toBe("user-3");
    });

    test("should clear all modifications", async () => {
      await mockApi.updateUser("user-1", { name: "Modified" });
      mockApi.resetMockData();
      const user = await mockApi.fetchUserById("user-1");
      expect(user.name).toBe("John Doe");
    });
  });

  describe("Complex Workflows", () => {
    test("should handle create, update, and delete workflow", async () => {
      const newTodo = await mockApi.createTodo(
        "user-1",
        "Workflow Todo",
        false,
      );
      expect(newTodo.id).toBeDefined();

      const updated = await mockApi.updateTodo(newTodo.id, { completed: true });
      expect(updated.completed).toBe(true);

      const deleted = await mockApi.deleteTodo(newTodo.id);
      expect(deleted.id).toBe(newTodo.id);

      try {
        await mockApi.fetchTodoById(newTodo.id);
        fail("Should have thrown error");
      } catch (error) {
        expect(error.message).toContain("not found");
      }
    });

    test("should handle user with multiple todos", async () => {
      const user = await mockApi.fetchUserById("user-2");
      expect(user.todos.length).toBe(3);

      const userTodos = await mockApi.fetchTodosByUserId("user-2");
      expect(userTodos.length).toBe(user.todos.length);

      userTodos.forEach((todo) => {
        expect(todo.userId).toBe("user-2");
      });
    });

    test("should handle creating and filtering todos", async () => {
      await mockApi.createTodo("user-1", "New Incomplete", false);
      await mockApi.createTodo("user-1", "New Complete", true);

      const userTodos = await mockApi.fetchTodosByUserId("user-1");
      const completed = userTodos.filter((t) => t.completed);
      const incomplete = userTodos.filter((t) => !t.completed);

      expect(completed.length).toBeGreaterThan(0);
      expect(incomplete.length).toBeGreaterThan(0);
    });
  });
});
