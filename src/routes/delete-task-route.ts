import { buildRoutePath } from "@/utils/build-route-path";
import type { Route } from "./routes";

export const deleteTaskRoute: Route = {
  method: "DELETE",
  path: buildRoutePath("/tasks/:id"),
  handler: async (_req, res) => {
    res.end(JSON.stringify({ message: "Delete task" }));
  },
};
