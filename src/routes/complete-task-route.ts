import { Task } from "@/application/entity/task/task-entity";
import { database } from "@/infra/database/database";
import { buildRoutePath } from "@/utils/build-route-path";
import type { Route } from "./routes";

export const completeTaskRoute: Route = {
  method: "PATCH",
  path: buildRoutePath("/tasks/:id/complete"),
  handler: async (req, res) => {
    try {
      const { id } = req.params;
      const [task] = await database.select("tasks", { id });

      if (!task) {
        res.writeHead(404).end(JSON.stringify({ message: "Task not found" }));
        return;
      }

      const updatedTask = new Task(task);
      updatedTask.complete();

      await database.update("tasks", updatedTask.toJSON(), { id });

      res.writeHead(200).end(
        JSON.stringify({
          message: "Task marked as completed",
          task: updatedTask,
        })
      );
    } catch (error) {
      res.writeHead(500).end(JSON.stringify({ error }));
    }
  },
};
