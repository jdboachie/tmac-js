import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { Command } from "commander";
import { APIClient } from "../../core/api.js";

const { version } = require("../package.json");
const client = new APIClient();
const program = new Command();

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
  .action(async (options) => {
    try {
      let todos = options.user
        ? await client.fetchTodosByUserId(options.user)
        : await client.fetchTodos();

      const complete =
        options.complete === (undefined || null)
          ? undefined
          : options.complete.toLowerCase() === "true";

      console.log(`Showing todos for user: ${todos[0].userId}`);

      if (complete !== undefined) {
        console.log(`Filtering by complete: ${options.complete}`);
        todos = todos.filter((t) => t.isCompleted === complete);
      }

      if (!todos || todos.length === 0) {
        console.log(
          `No todos found for user ${options.user}. Try adjusting your filter`,
        );
        return;
      }

      console.log("\n");
      console.table(
        todos.map((t) => ({
          status: t.getStatus(),
          title: t.title,
        })),
      );
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  });

program
  .command("stat")
  .description("Show task statistics for a specified user")
  .argument("<user>", "The user to show statistics for")
  .action((user) => {
    console.log(`running stat for user with id: ${user}`);
  });

program.parse(process.argv);
