import { buildRoutePath } from "@/utils/build-route-path";
import type { Route } from "./routes";

export const completeTaskRoute: Route = {
  method: "PATCH",
  path: buildRoutePath("/tasks/:id/complete"),
  handler: async (_req, res) => {
    res.end(JSON.stringify({ message: "Complete task" }));
  },
};
