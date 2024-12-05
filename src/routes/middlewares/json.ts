import type { IncomingMessage, ServerResponse } from "node:http";

export function json(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
}
