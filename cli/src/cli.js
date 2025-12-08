import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { Command } from "commander";
import { APIClient } from "../../core/api.js";
import { writeFileSync } from "fs";

const { version } = require("../package.json");
const client = new APIClient();
const program = new Command();

/**
 * Exports the given data to the given path.
 * @param {string} path - the file path to write to
 * @param {any} data - any serializable object
 */
function exportToJson(path, data) {
  const payload = JSON.stringify(data, null, 2);
  writeFileSync(path, payload, "utf-8");
}

program
  .name("tmac")
  .description("TMAC (Task Management API Client)")
  .version(version, "-v, --version", "output the current version");

program
  .command("list")
  .description(
    "List todos. Will list todos for a user if a userId is specified",
  )
  .option("-u, --user <number>", "filter todos by user", null)
  .option("-c, --complete <value>", "filter todos by completion", null)
  .option("-e, --export [file]", "export to JSON file (default: todos.json)")
  .action(async (options) => {
    try {
      let todos = options.user
        ? await client.fetchTodosByUserId(options.user)
        : await client.fetchTodos();

      if (!todos || todos.length === 0) {
        console.log(
          `No todos found for user ${options.user}. Try adjusting your filter`,
        );
        return;
      }

      const complete =
        options.complete === (undefined || null)
          ? undefined
          : options.complete.toLowerCase() === "true";

      console.log(`Showing todos for user: ${todos[0].userId}`);

      if (complete !== undefined) {
        console.log(`Filtering by complete: ${options.complete}`);
        todos = todos.filter((t) => t.isCompleted === complete);
      }

      console.log("\n");
      console.table(
        todos.map((t) => ({
          status: t.getStatus(),
          title: t.title,
        })),
      );

      if (options.export) {
        const filePath =
          typeof options.export == "string" ? options.export : "todos.json";
        exportToJson(filePath, todos);
        console.log(`Exported ${todos.length} todos to ${filePath}`)
      }
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  });

program
  .command("stat")
  .description("Show task statistics for a specified user")
  .argument("<user>", "The user to show statistics for")
  .action(async (user) => {
    if (user === null) {
      console.error("No user id was supplied.");
      return;
    }

    const todos = await client.fetchTodosByUserId(user);
    let tempUser = await client.fetchUserById(todos[0].userId);
    tempUser.todos = todos;

    console.log(`Showing statistics for user: ${todos[0].userId}\n`);

    console.log("[USER]");
    console.log(tempUser.name);
    console.log(tempUser.email, "\n");

    console.log("[STATS]");
    console.log(`Total todos:\t\t`, tempUser.todos.length);
    console.log(`Completion Rate:\t`, `${tempUser.getCompletionRate() * 100}%`);
  });

program.parse(process.argv);
