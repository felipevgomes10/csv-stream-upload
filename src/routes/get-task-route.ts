import { database } from "@/infra/database/database";
import { buildRoutePath } from "@/utils/build-route-path";
import type { Route } from "./routes";

export const getTaskRoute: Route = {
  method: "GET",
  path: buildRoutePath("/tasks/:id"),
  handler: async (req, res) => {
    try {
      const { id } = req.params;
      const [task] = await database.select("tasks", { id });

      if (!task) {
        res.writeHead(404).end(JSON.stringify({ message: "Task not found" }));
        return;
      }

      res.writeHead(200).end(JSON.stringify({ task }));
    } catch (error) {
      res.writeHead(500).end(JSON.stringify({ error }));
    }
  },
};
