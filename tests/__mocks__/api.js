const mockUsers = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    todos: [
      { id: "todo-1", title: "Buy groceries", completed: false, userId: "user-1" },
      { id: "todo-2", title: "Finish project", completed: true, userId: "user-1" },
    ],
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    todos: [
      { id: "todo-3", title: "Review code", completed: false, userId: "user-2" },
      { id: "todo-4", title: "Update docs", completed: false, userId: "user-2" },
      { id: "todo-5", title: "Deploy app", completed: true, userId: "user-2" },
    ],
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob@example.com",
    todos: [],
  },
];

const mockTodos = [
  { id: "todo-1", title: "Buy groceries", completed: false, userId: "user-1" },
  { id: "todo-2", title: "Finish project", completed: true, userId: "user-1" },
  { id: "todo-3", title: "Review code", completed: false, userId: "user-2" },
  { id: "todo-4", title: "Update docs", completed: false, userId: "user-2" },
  { id: "todo-5", title: "Deploy app", completed: true, userId: "user-2" },
  { id: "todo-6", title: "Plan sprint", completed: true, userId: "user-1" },
];

const mockApi = {
  fetchAllUsers: () => {
    return Promise.resolve(mockUsers);
  },

  fetchUserById: (userId) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return Promise.reject(new Error(`User with id ${userId} not found`));
    }
    return Promise.resolve(user);
  },

  fetchAllTodos: () => {
    return Promise.resolve(mockTodos);
  },

  fetchTodosByUserId: (userId) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return Promise.reject(new Error(`User with id ${userId} not found`));
    }
    return Promise.resolve(user.todos);
  },

  fetchTodoById: (todoId) => {
    const todo = mockTodos.find((t) => t.id === todoId);
    if (!todo) {
      return Promise.reject(new Error(`Todo with id ${todoId} not found`));
    }
    return Promise.resolve(todo);
  },

  createTodo: (userId, title, completed = false) => {
    const newTodo = {
      id: `todo-${Date.now()}`,
      title,
      completed,
      userId,
    };
    mockTodos.push(newTodo);
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      user.todos.push(newTodo);
    }
    return Promise.resolve(newTodo);
  },

  updateTodo: (todoId, updates) => {
    const todo = mockTodos.find((t) => t.id === todoId);
    if (!todo) {
      return Promise.reject(new Error(`Todo with id ${todoId} not found`));
    }
    const updatedTodo = { ...todo, ...updates };
    const index = mockTodos.findIndex((t) => t.id === todoId);
    mockTodos[index] = updatedTodo;
    return Promise.resolve(updatedTodo);
  },

  deleteTodo: (todoId) => {
    const index = mockTodos.findIndex((t) => t.id === todoId);
    if (index === -1) {
      return Promise.reject(new Error(`Todo with id ${todoId} not found`));
    }
    const deleted = mockTodos.splice(index, 1);
    mockUsers.forEach((user) => {
      user.todos = user.todos.filter((t) => t.id !== todoId);
    });
    return Promise.resolve(deleted[0]);
  },

  createUser: (name, email) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      todos: [],
    };
    mockUsers.push(newUser);
    return Promise.resolve(newUser);
  },

  updateUser: (userId, updates) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return Promise.reject(new Error(`User with id ${userId} not found`));
    }
    const updatedUser = { ...user, ...updates };
    const index = mockUsers.findIndex((u) => u.id === userId);
    mockUsers[index] = updatedUser;
    return Promise.resolve(updatedUser);
  },

  deleteUser: (userId) => {
    const index = mockUsers.findIndex((u) => u.id === userId);
    if (index === -1) {
      return Promise.reject(new Error(`User with id ${userId} not found`));
    }
    const deleted = mockUsers.splice(index, 1);
    const deletedTodoIds = deleted[0].todos.map((t) => t.id);
    deletedTodoIds.forEach((todoId) => {
      const todoIndex = mockTodos.findIndex((t) => t.id === todoId);
      if (todoIndex !== -1) {
        mockTodos.splice(todoIndex, 1);
      }
    });
    return Promise.resolve(deleted[0]);
  },

  resetMockData: () => {
    mockUsers.length = 0;
    mockTodos.length = 0;
    mockUsers.push(
      {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        todos: [
          { id: "todo-1", title: "Buy groceries", completed: false, userId: "user-1" },
          { id: "todo-2", title: "Finish project", completed: true, userId: "user-1" },
        ],
      },
      {
        id: "user-2",
        name: "Jane Smith",
        email: "jane@example.com",
        todos: [
          { id: "todo-3", title: "Review code", completed: false, userId: "user-2" },
          { id: "todo-4", title: "Update docs", completed: false, userId: "user-2" },
          { id: "todo-5", title: "Deploy app", completed: true, userId: "user-2" },
        ],
      },
      {
        id: "user-3",
        name: "Bob Johnson",
        email: "bob@example.com",
        todos: [],
      }
    );
    mockTodos.push(
      { id: "todo-1", title: "Buy groceries", completed: false, userId: "user-1" },
      { id: "todo-2", title: "Finish project", completed: true, userId: "user-1" },
      { id: "todo-3", title: "Review code", completed: false, userId: "user-2" },
      { id: "todo-4", title: "Update docs", completed: false, userId: "user-2" },
      { id: "todo-5", title: "Deploy app", completed: true, userId: "user-2" },
      { id: "todo-6", title: "Plan sprint", completed: true, userId: "user-1" }
    );
  },

  getMockUsers: () => mockUsers,
  getMockTodos: () => mockTodos,
};

export default mockApi;
