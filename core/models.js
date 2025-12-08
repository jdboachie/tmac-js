/**
 * Represents a Todo's status
 */
export const TodoStatus = Object.freeze({
  PENDING: "PENDING",
  COMPLETE: "COMPLETE",
});

/**
 * Represents a todo
 */
export class Todo {
  /**
   * @param {string} id - unique id
   * @param {string} title - todo title
   * @param {boolean} isCompleted - true if completed else false
   * @param {string} userId - links to the id field on a userId
   */
  constructor(id, title, isCompleted, userId) {
    this.id = id;
    this.title = title;
    this.isCompleted = isCompleted;
    this.userId = userId;
  }

  static fromDict = (dict) => {
    try {
      return new Todo(
        dict.id,
        dict.title,
        Boolean(dict.completed),
        dict.userId,
      );
    } catch (err) {
      console.error(`Couldn't create user from dict: ${err}`);
    }
  };

  isCreatedBy = (userId) => {
    return this.userId == userId;
  };

  /**
   * Toggles todo state. Completed ↔ Not Completed
   */
  toggle = () => {
    this.isCompleted = !this.isCompleted;
  };

  /**
   * TODO: THIS MIGHT BE REDUNDANT
   * @returns {Status} the status of the todo
   */
  getStatus() {
    return this.isCompleted ? TodoStatus.COMPLETE : TodoStatus.PENDING;
  }

  /**
   * Checks if a Todo is overdue
   * @returns {boolean} always returns false
   * since the Todo base class does not have a `dueDate` attribute
   */
  isOverDue = () => false;
}

/**
 * Represents a Todo with priority and due date
 */
export class PriorityTodo extends Todo {
  #priority;
  #dueDate;

  /**
   * @param {string} id - unique id
   * @param {string} title - todo title
   * @param {boolean} isCompleted - true if completed else false
   * @param {string} userId - links to the id field on a userId
   * @param {number} priority - used to order by priority
   * @param {Date} dueDate - todo deadline
   */
  constructor(id, title, isCompleted, userId, priority, dueDate) {
    super(id, title, isCompleted, userId);
    this.#priority = priority;
    this.#dueDate = dueDate;
  }

  /**
   * Check if a priority todo is overdue
   * (was due at an earlier date and is not completed)
   * @returns {boolean} true if todo is overdue otherwise false
   */
  isOverDue = () => {
    if (!this.#dueDate) return false;
    return new Date(this.#dueDate) < new Date() && !this.isCompleted;
  };

  /**
   * Returns the status of a todo
   * @returns {Status} the status of the todo
   */
  getStatus = () => super.getStatus();
}

/**
 * Represents a User in our application
 */
export class User {
  #id;
  #name;
  #email;
  #todos;

  /**
   * @param {string} id - unique id for each user
   * @param {string} name - the user's name (fistname lastname)
   * @param {string} email - the user's email addresss
   * @param {Todo[]} todos - an array of the user's todos.
   */
  constructor(id, name, email, todos) {
    this.#id = id;
    this.#name = name;
    this.#email = email;
    this.#todos = todos;
  }

  static fromDict = (dict) => {
    try {
      return new User(dict.id, dict.name, dict.email, dict.todos ?? []);
    } catch (err) {
      console.error(`Couldn't create user from dict: ${err}`);
    }
  };

  /**
   * Adds a todo to the user's todos
   * @param {Todo} todo - the new todo
   */
  addTodo = (todo) => {
    this.#todos.push(todo);
  };

  /**
   * Calculates the percentage of completed user todos
   * @returns {number} completion rate (bewteen 0 and 1)
   */
  getCompletionRate = () => {
    const numCompleted = this.#todos.reduce((num, todo) => {
      return todo.getStatus() === TodoStatus.COMPLETE ? num + 1 : num;
    }, 0);

    return numCompleted > 0 ? numCompleted / this.#todos.length : 0;
  };

  /**
   * Returns the user's todos filtered by `status`
   * @param {Status} status - status filter
   * @returns {Todo[]} list of user's todos filtered by status
   */
  getTodosByStatus = (status) => {
    return this.#todos.filter((todo) => todo.getStatus() == status);
  };
}
