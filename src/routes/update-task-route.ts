import { buildRoutePath } from "@/utils/build-route-path";
import type { Route } from "./routes";

export const updateTaskRoute: Route = {
  method: "PUT",
  path: buildRoutePath("/tasks/:id"),
  handler: async (_req, res) => {
    res.end(JSON.stringify({ message: "Update task" }));
  },
};
