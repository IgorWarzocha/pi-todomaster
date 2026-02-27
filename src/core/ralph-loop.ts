import fs from "node:fs/promises";
import path from "node:path";
import type { TodoRecord } from "./types.js";

interface RalphLoopPrepared {
  scriptPath: string;
  promptPath: string;
  command: string;
}

function commandPath(cwd: string, value: string): string {
  const rel = path.relative(cwd, value).replaceAll("\\", "/");
  if (!rel || rel.startsWith("..")) return value;
  if (rel.startsWith(".")) return rel;
  return `./${rel}`;
}

function promptName(record: TodoRecord): string {
  const type = record.type || "todo";
  return `${type}-${record.id}.md`;
}

function scriptBody(): string {
  return [
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    'PROMPT_FILE="${1:?Usage: run.sh /path/to/prompt.md}"',
    'AGENT_CMD="${AGENT_CMD:-pi -p --no-session}"',
    "while :; do",
    '  bash -lc "$AGENT_CMD" < "$PROMPT_FILE"',
    "done",
    "",
  ].join("\n");
}

export async function prepareRalphLoop(
  cwd: string,
  record: TodoRecord,
  prompt: string,
): Promise<RalphLoopPrepared> {
  const baseDir = path.resolve(cwd, ".pi", "ralph-loop");
  const promptDir = path.join(baseDir, "prompts");
  const scriptPath = path.join(baseDir, "run.sh");
  const promptPath = path.join(promptDir, promptName(record));

  await fs.mkdir(promptDir, { recursive: true });
  await fs.writeFile(scriptPath, scriptBody(), "utf8");
  await fs.chmod(scriptPath, 0o755);
  await fs.writeFile(promptPath, `${prompt.trim()}\n`, "utf8");

  const command = `AGENT_CMD='pi -p --no-session' bash \"${commandPath(cwd, scriptPath)}\" \"${commandPath(cwd, promptPath)}\"`;
  return { scriptPath, promptPath, command };
}
