import path from "node:path";

interface RalphLoopPrepared {
  planPath: string;
  command: string;
}

function commandPath(cwd: string, value: string): string {
  const rel = path.relative(cwd, value).replaceAll("\\", "/");
  if (!rel || rel.startsWith("..")) return value;
  if (rel.startsWith(".")) return rel;
  return `./${rel}`;
}

export function prepareRalphLoop(cwd: string, planPath: string): RalphLoopPrepared {
  const target = commandPath(cwd, planPath);
  const command =
    `PROMPT_FILE=\"${target}\"; ` +
    "AGENT_CMD='pi -p --no-session'; " +
    'while :; do bash -lc "$AGENT_CMD" < "$PROMPT_FILE"; done';
  return { planPath, command };
}
