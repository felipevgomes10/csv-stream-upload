import type { QueryParams, RouteParams } from "./routes/routes";

declare module "node:http" {
  interface IncomingMessage {
    params: RouteParams;
    query: QueryParams;
    body?: Record<string, unknown>;
  }
}
