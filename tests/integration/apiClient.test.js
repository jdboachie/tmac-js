import { APIClient } from "../../core/api.js";
import { Todo, User } from "../../core/models.js";

describe("APIClient Integration Tests with Mocked Fetch", () => {
  let apiClient;
  let fetchMock;

  beforeEach(() => {
    apiClient = new APIClient();
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test 1: fetchUsers() returns array of User objects on successful fetch", async () => {
    const mockUsersData = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ];

    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUsersData),
    });

    const users = await apiClient.fetchUsers();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(users).toHaveLength(2);
    expect(users[0]).toBeInstanceOf(User);
    expect(users[1]).toBeInstanceOf(User);
  });

  test("Test 2: fetchUsers() handles network failure gracefully", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));

    const result = await apiClient.fetchUsers();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users",
    );
    expect(result).toBeUndefined();
  });

  test("Test 3: fetchTodos() returns array of Todo objects on successful fetch", async () => {
    const mockTodosData = [
      { id: 1, title: "Task 1", completed: false, userId: 1 },
      { id: 2, title: "Task 2", completed: true, userId: 1 },
    ];

    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockTodosData),
    });

    const todos = await apiClient.fetchTodos();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/todos",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(todos).toHaveLength(2);
    expect(todos[0]).toBeInstanceOf(Todo);
    expect(todos[1]).toBeInstanceOf(Todo);
    expect(todos[0].isCompleted).toBe(false);
    expect(todos[1].isCompleted).toBe(true);
  });

  test("Test 4: fetchTodosByUserId() calls correct endpoint with user ID", async () => {
    const mockUserTodosData = [
      { id: 1, title: "User 1 Task", completed: false, userId: 1 },
    ];

    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUserTodosData),
    });

    const todos = await apiClient.fetchTodosByUserId("1");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users/1/todos",
    );
    expect(todos).toHaveLength(1);
    expect(todos[0]).toBeInstanceOf(Todo);
    expect(todos[0].userId).toBe(1);
  });

  test("Test 5: fetchUsers() handles non-OK HTTP response (404)", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: jest.fn().mockResolvedValue("Resource not found"),
    });

    const result = await apiClient.fetchUsers();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users",
    );
    expect(result).toBeUndefined();
  });

  test("Test 6: fetchTodos() handles non-OK HTTP response (500)", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: jest.fn().mockResolvedValue("Server error"),
    });

    const result = await apiClient.fetchTodos();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/todos",
    );
    expect(result).toBeUndefined();
  });

  test("Test 7: fetchTodosByUserId() returns empty array when user has no todos", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    const todos = await apiClient.fetchTodosByUserId("99");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users/99/todos",
    );
    expect(todos).toEqual([]);
  });

  test("Test 8: fetchUserById() calls correct endpoint and returns User object", async () => {
    const mockUserData = { id: 5, name: "Test User", email: "test@example.com" };

    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUserData),
    });

    const user = await apiClient.fetchUserById("5");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users/5",
    );
    expect(user).toBeInstanceOf(User);
  });

  test("Test 9: API response parsing correctly creates Todo objects with all properties", async () => {
    const mockTodoData = {
      id: 42,
      title: "Complete project",
      completed: true,
      userId: 3,
    };

    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([mockTodoData]),
    });

    const todos = await apiClient.fetchTodos();

    expect(todos[0].id).toBe(42);
    expect(todos[0].title).toBe("Complete project");
    expect(todos[0].isCompleted).toBe(true);
    expect(todos[0].userId).toBe(3);
  });

  test("Test 10: Multiple sequential API calls maintain independent fetch mocks", async () => {
    const mockUsersData = [{ id: 1, name: "User", email: "user@example.com" }];
    const mockTodosData = [
      { id: 1, title: "Todo", completed: false, userId: 1 },
    ];

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUsersData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockTodosData),
      });

    const users = await apiClient.fetchUsers();
    const todos = await apiClient.fetchTodos();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://jsonplaceholder.typicode.com/users",
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://jsonplaceholder.typicode.com/todos",
    );
    expect(users).toHaveLength(1);
    expect(todos).toHaveLength(1);
  });
});
