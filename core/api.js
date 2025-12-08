import { Todo, User } from "./models.js";

/**
 * Represents the API client used to fetch data
 * from the jsonplaceholder api (https://jsonplaceholder.typicode.com)
 */
export class APIClient {
  #BASEURL = "https://jsonplaceholder.typicode.com";

  constructor() {
    // an api client can have timeout, ratelimiting, etc
  }

  /**
   * Queries the api for users and returns a list of `User` objects
   * @returns {Promise<User[]>} list of users from the database
   */
  fetchUsers = async () => {
    try {
      let response = await fetch(this.#BASEURL + "/users");
      let data = await response.json();
      let users = data.map((item) => User.fromDict(item));
      return users;
    } catch (err) {
      console.log(`Error fetching users: ${err}`);
    }
  };

  /**
   * Queries the api for todos and returns a list of `Todo` objects
   * @returns {Promise<Todo[]>} list of todos from the database
   */
  fetchTodos = async () => {
    try {
      let res = await fetch(this.#BASEURL + "/todos");
      let data = await res.json();
      let todos = data.map((item) => Todo.fromDict(item));
      return todos;
    } catch (error) {
      console.log(`Error fetching tasks: ${error}`);
    }
  };

  /**
   * Queries the api for todos and filters by userId;
   * returns a list of `Todo` objects
   * @param {string} userId - the unique userId to results by
   * @returns {Promise<Todo[]>} list of todos filtered by userId
   */
  fetchTodosByUserId = async (userId) => {
    if (isNaN(Number(userId))) {
      throw new Error(`Invalid userId: ${userId}`);
    }

    try {
      let res = await fetch(this.#BASEURL + `/users/${userId}/todos`);
      let data = await res.json();
      let todos = data.map((item) => Todo.fromDict(item));
      return todos;
    } catch (error) {
      console.log(`Error fetching users: ${error}`);
    }
  };
}
