import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function getCliPath(): string {
  const env = process.env.PI_TODOS_CLI_PATH;
  if (env && env.trim()) return env.trim();
  const file = fileURLToPath(import.meta.url);
  const dir = path.dirname(file);
  const candidates = [
    path.resolve(dir, "../app/cli/index.js"),
    path.resolve(dir, "../../dist/src/app/cli/index.js"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(
    "Could not locate the pi-todomaster CLI. Run `npm run build` or set PI_TODOS_CLI_PATH.",
  );
}
