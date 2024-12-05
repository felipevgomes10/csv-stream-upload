import { buildRoutePath } from "@/utils/build-route-path";
import type { IncomingMessage, ServerResponse } from "node:http";

export type Route = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: RegExp;
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
};

export type RouteParams = {
  id: string;
};

export type QueryParams = {
  search: string;
};

export const routes: Route[] = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      res.end(
        JSON.stringify({
          message: "Tasks",
          params: req.params,
          query: req.query,
        })
      );
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      res.end(
        JSON.stringify({
          message: "Task",
          params: req.params,
          query: req.query,
        })
      );
    },
  },
];
