import { database } from "@/infra/database/database";
import { buildRoutePath } from "@/utils/build-route-path";
import type { Route } from "./routes";

export const getTasksRoute: Route = {
  method: "GET",
  path: buildRoutePath("/tasks"),
  handler: async (req, res) => {
    try {
      const { title, description } = req.query;
      const tasks = await database.select("tasks", { title, description });

      res.writeHead(200).end(JSON.stringify({ tasks }));
    } catch (error) {
      res.writeHead(500).end(JSON.stringify({ error }));
    }
  },
};
