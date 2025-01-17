import type { IncomingMessage, ServerResponse } from "node:http";
import { completeTaskRoute } from "./complete-task-route";
import { createTaskBulkRoute } from "./create-task-bulk-route";
import { createTaskRoute } from "./create-task-route";
import { deleteTaskRoute } from "./delete-task-route";
import { getTaskRoute } from "./get-task-route";
import { getTasksRoute } from "./get-tasks-route";
import { updateTaskRoute } from "./update-task-route";

export type Route = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: RegExp;
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
};

export const routes: Route[] = [
  getTasksRoute,
  getTaskRoute,
  updateTaskRoute,
  createTaskRoute,
  createTaskBulkRoute,
  deleteTaskRoute,
  completeTaskRoute,
];
