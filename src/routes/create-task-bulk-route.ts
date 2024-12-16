import { Task } from "@/application/entity/task/task-entity";
import { database } from "@/infra/database/database";
import { buildRoutePath } from "@/utils/build-route-path";
import csv from "csv-parse";
import { Readable, Transform, Writable } from "node:stream";
import z from "zod";
import type { Route } from "./routes";

type CreateTaskBulkRouteRowSucceeded = {
  message: string;
  task: { id: string; row: number };
};

type CreateTaskBulkRouteRowFailed = {
  message: string;
  error: string;
  row: number;
};

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const createTaskBulkRoute: Route = {
  method: "POST",
  path: buildRoutePath("/tasks/bulk"),
  handler: async (req, res) => {
    try {
      let rowIndex = 1; // skip the headers

      const csvReadStream = Readable.from(Buffer.from(req.body as string));

      const csvParseStream = csv.parse({ columns: true, skipEmptyLines: true });

      const csvTransformStream = new Transform({
        objectMode: true,
        transform(chunk, _encoding, callback) {
          const { error, success, data } = createTaskSchema.safeParse(chunk);

          if (!success) {
            const { fieldErrors } = error.flatten();

            this.push({
              message: "Task creation failed",
              error: fieldErrors,
              row: rowIndex++,
            });
            callback();

            return;
          }

          const task = new Task(data);

          this.push({ task: task.toJSON(), row: rowIndex++ });
          callback();
        },
      });

      const createdTasks: CreateTaskBulkRouteRowSucceeded[] = [];
      const failedTasks: CreateTaskBulkRouteRowFailed[] = [];

      const csvWriteStream = new Writable({
        objectMode: true,
        async write(chunk, _encoding, callback) {
          if (chunk.error) {
            failedTasks.push(chunk);

            callback();

            return;
          }

          await database.insert("tasks", chunk.task);

          createdTasks.push({
            message: "Task created successfully",
            task: { id: chunk.task.id, row: chunk.row },
          });

          callback();
        },
      });

      csvTransformStream
        .on("error", (error) => {
          res.writeHead(500).end(JSON.stringify({ error }));
        })
        .on("data", () => {
          console.log("Processing row: ", rowIndex - 1);
        });

      csvWriteStream
        .on("error", (error) => {
          res.writeHead(500).end(JSON.stringify({ error }));
        })
        .on("finish", () => {
          const hasOnlyFailedTasks = createdTasks.length === 0;

          if (hasOnlyFailedTasks) {
            res.writeHead(400).end(JSON.stringify({ failedTasks }));
            return;
          }

          res.writeHead(201).end(JSON.stringify({ createdTasks, failedTasks }));
        });

      csvReadStream
        .pipe(csvParseStream)
        .pipe(csvTransformStream)
        .pipe(csvWriteStream);
    } catch (error) {
      res.writeHead(500).end(JSON.stringify({ error }));
    }
  },
};
