import { existsSync } from "node:fs";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { getTodosDir, readTodoSettings, garbageCollectTodos } from "./src/io/index.js";
import { registerTodoCommand } from "./src/app/command/index.js";

export default function todosExtension(pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    const todosDir = getTodosDir(ctx.cwd);
    if (!existsSync(todosDir)) return;
    const settings = await readTodoSettings(todosDir);
    await garbageCollectTodos(todosDir, settings);
  });

  registerTodoCommand(pi);
}
