import { APIClient } from "./core/api.js";
import { Todo } from "./core/models.js";

const client = new APIClient();

class TodoReplyEvent {
  constructor(data) {
    this.data = data;
  }
}

class StatChangeEvent {
  constructor(count, completionRate) {
    this.count = count;
    this.completionRate = completionRate;
  }
}

let pubsub = {
  events: {},

  subscribe(event, handler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  },

  publish(event, data) {
    if (!this.events[event]) return;
    for (const handler of this.events[event]) {
      handler(data);
    }
  },
};

let view = {
  form: document.getElementById("todo-form"),
  list: document.getElementById("todo-list"),

  /**
   * Creates a Todo HTML Template
   * @param {Todo} data
   * @returns {string} HTML template
   */
  createTodoTemplate(data) {
    return `
      <li class="todo__item">${data.title}</li>
    `;
  },

  updateTodoList(data) {
    console.log(data);
    if (!data) return;
    console.log(data[0]);
    data.forEach((item) => {
      let childNode = document.createElement("li");
      childNode.innerHTML = this.createTodoTemplate(item);
      this.list.appendChild(childNode);
    });
  },
};

async function getTodos() {
  let data = await client.fetchTodos();
  pubsub.publish("TodoReplyEvent", new TodoReplyEvent(data));
}

function run() {
  view.form.onsubmit = function (event) {
    event.preventDefault();
  };

  getTodos();

  pubsub.subscribe("TodoReplyEvent", (event) => {
    view.updateTodoList(event.data);
  });
}

run();
