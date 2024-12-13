import { Task } from "@/application/entity/task/task-entity";
import { database } from "@/infra/database/database";
import { buildRoutePath } from "@/utils/build-route-path";
import z from "zod";
import type { Route } from "./routes";

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export const updateTaskRoute: Route = {
  method: "PUT",
  path: buildRoutePath("/tasks/:id"),
  handler: async (req, res) => {
    try {
      const { id } = req.params;
      const [task] = await database.select("tasks", { id });

      if (!task) {
        res.writeHead(404).end(JSON.stringify({ message: "Task not found" }));
        return;
      }

      const { error, success, data } = updateTaskSchema.safeParse(req.body);

      if (!success) {
        const { fieldErrors } = error.flatten();

        res.writeHead(400).end(JSON.stringify({ error: fieldErrors }));
        return;
      }

      const { title, description } = data;
      const updatedTask = new Task(task);

      updatedTask.title = title ?? updatedTask.title;
      updatedTask.description = description ?? updatedTask.description;

      await database.update("tasks", updatedTask.toJSON(), { id });

      res.writeHead(200).end(
        JSON.stringify({
          message: "Task updated successfully",
          task: updatedTask,
        })
      );
    } catch (error) {
      res.writeHead(500).end(JSON.stringify({ error }));
    }
  },
};
