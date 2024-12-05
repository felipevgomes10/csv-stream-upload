import { buildRoutePath } from "@/utils/build-route-path";
import type { Route } from "./routes";

export const createTaskRoute: Route = {
  method: "POST",
  path: buildRoutePath("/tasks"),
  handler: async (_req, res) => {
    res.end(JSON.stringify({ message: "Create task" }));
  },
};
