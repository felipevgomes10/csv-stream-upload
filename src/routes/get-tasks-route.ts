import { database } from "@/infra/database/database";
import { buildRoutePath } from "@/utils/build-route-path";
import type { Route } from "./routes";

export const getTasksRoute: Route = {
  method: "GET",
  path: buildRoutePath("/tasks"),
  handler: async (_req, res) => {
    try {
      const tasks = await database.select("tasks");

      res.writeHead(200).end(JSON.stringify({ tasks }));
    } catch (error) {
      res.writeHead(500).end(JSON.stringify({ error }));
    }
  },
};
