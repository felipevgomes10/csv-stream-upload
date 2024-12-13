import { database } from "@/infra/database/database";
import { buildRoutePath } from "@/utils/build-route-path";
import type { Route } from "./routes";

export const deleteTaskRoute: Route = {
  method: "DELETE",
  path: buildRoutePath("/tasks/:id"),
  handler: async (req, res) => {
    try {
      const { id } = req.params;
      const [task] = await database.select("tasks", { id });

      if (!task) {
        res.writeHead(404).end(JSON.stringify({ message: "Task not found" }));
        return;
      }

      await database.delete("tasks", { id });

      res.writeHead(204).end();
    } catch (error) {
      res.writeHead(500).end(JSON.stringify({ error }));
    }
  },
};
