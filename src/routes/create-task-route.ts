import { Task } from "@/application/entity/task/task-entity";
import { database } from "@/infra/database/database";
import { buildRoutePath } from "@/utils/build-route-path";
import { z } from "zod";
import type { Route } from "./routes";

const createTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const createTaskRoute: Route = {
  method: "POST",
  path: buildRoutePath("/tasks"),
  handler: async (req, res) => {
    try {
      const { error, success, data } = createTaskSchema.safeParse(req.body);

      if (!success) {
        const { fieldErrors } = error.flatten();
        const errorMessage = !req.body
          ? "title and description are required"
          : fieldErrors;

        res.writeHead(400).end(JSON.stringify({ error: errorMessage }));
        return;
      }

      const { title, description } = data;
      const task = new Task({ title, description });

      await database.insert("tasks", task.toJSON());

      res.writeHead(201).end(
        JSON.stringify({
          message: "Task created successfully",
          task: { id: task.id },
        })
      );
    } catch (error) {
      res.writeHead(500).end(JSON.stringify({ error }));
    }
  },
};
