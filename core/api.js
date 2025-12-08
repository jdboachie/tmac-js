import { Todo, User } from "./models.js";

/**
 * Represents the API client used to fetch data
 * from the jsonplaceholder api (https://jsonplaceholder.typicode.com)
 */
export class APIClient {
  #BASEURL = "https://jsonplaceholder.typicode.com";

  constructor() {
    // an api client can have timeout, ratelimiting, etc
    // might implement caching here
  }

  /**
   * Handles http errors and returns json if any
   * @param {Response} res - http response from API call
   * @returns reponse json
   */
  async handleResponse(res) {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `API request failed: ${res.status} ${res.statusText} - ${text}`,
      );
    }
    return res.json();
  }

  /**
   * Queries the api for users and returns a list of `User` objects
   * @returns {Promise<User[]>} list of users from the database
   */
  async fetchUsers() {
    try {
      let response = await fetch(this.#BASEURL + "/users");
      let data = await this.handleResponse(response);
      let users = data.map((item) => User.fromDict(item));
      return users;
    } catch (err) {
      console.log(`Error fetching users: ${err}`);
    }
  }

  /**
   * @todo - Handle cases where the API returns an error code.
   * @param {string} userId - the id of the user to fetch
   * @returns {Promise<User>} - the user from the api.
   */
  async fetchUserById(userId) {
    try {
      let response = await fetch(this.#BASEURL + `/users/${userId}`);
      let data = await this.handleResponse(response);
      return User.fromDict(data);
    } catch (err) {
      console.log(`Error fetching user: ${err}`);
    }
  }

  /**
   * Queries the api for todos and returns a list of `Todo` objects
   * @returns {Promise<Todo[]>} list of todos from the database
   */
  async fetchTodos() {
    try {
      let response = await fetch(this.#BASEURL + "/todos");
      let data = await this.handleResponse(response);
      let todos = data.map((item) => Todo.fromDict(item));
      return todos;
    } catch (error) {
      console.log(`Error fetching tasks: ${error}`);
    }
  }

  /**
   * Queries the api for todos and filters by userId;
   * returns a list of `Todo` objects
   * @param {string} userId - the unique userId to results by
   * @returns {Promise<Todo[]>} list of todos filtered by userId
   */
  async fetchTodosByUserId(userId) {
    if (isNaN(Number(userId))) {
      throw new Error(`Invalid userId: ${userId}`);
    }

    try {
      let response = await fetch(this.#BASEURL + `/users/${userId}/todos`);
      let data = await this.handleResponse(response);
      let todos = data.map((item) => Todo.fromDict(item));
      return todos;
    } catch (error) {
      console.log(`Error fetching users: ${error}`);
    }
  };
}
