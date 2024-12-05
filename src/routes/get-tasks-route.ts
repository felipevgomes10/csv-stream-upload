import { buildRoutePath } from "@/utils/build-route-path";
import type { Route } from "./routes";

export const getTasksRoute: Route = {
  method: "GET",
  path: buildRoutePath("/tasks"),
  handler: async (_req, res) => {
    res.end(JSON.stringify({ message: "Tasks" }));
  },
};
