import { database } from "@/infra/database/database";
import { buildRoutePath } from "@/utils/build-route-path";
import { TaskProcessor } from "@/utils/task-processor";
import csv from "csv-parse";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { Route } from "./routes";

export const createTaskBulkRoute: Route = {
  method: "POST",
  path: buildRoutePath("/tasks/bulk"),
  handler: async (req, res) => {
    try {
      const taskProcessor = new TaskProcessor(database);

      const csvReadStream = Readable.from(Buffer.from(req.body as string));

      const csvParseStream = csv.parse({ columns: true, skipEmptyLines: true });
      const csvTransformStream = taskProcessor.createTransformStream();

      const csvWriteStream = taskProcessor.createWriteStream();

      csvTransformStream.on("error", (error) => {
        res.writeHead(500).end(JSON.stringify({ error }));
      });

      csvWriteStream
        .on("error", (error) => {
          res.writeHead(500).end(JSON.stringify({ error }));
        })
        .on("finish", () => {
          const { createdTasks, failedTasks } = taskProcessor.getResults();
          const hasOnlyFailedTasks = createdTasks.length === 0;

          if (hasOnlyFailedTasks) {
            res.writeHead(400).end(JSON.stringify({ failedTasks }));
            return;
          }

          res.writeHead(201).end(JSON.stringify({ createdTasks, failedTasks }));
        });

      await pipeline(
        csvReadStream,
        csvParseStream,
        csvTransformStream,
        csvWriteStream
      );
    } catch (error) {
      res.writeHead(500).end(JSON.stringify({ error }));
    }
  },
};
