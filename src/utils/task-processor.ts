import { Task, type TaskData } from "@/application/entity/task/task-entity";
import type { DatabaseShape, IDatabase } from "@/infra/database/database";
import { Transform, Writable } from "node:stream";
import z from "zod";

type TaskCreationResult =
  | {
      message: string;
      task?: never;
      error: string;
      row: number;
    }
  | {
      message: string;
      task: { id: string };
      error?: never;
      row: number;
    };

type GetResults = {
  createdTasks: TaskCreationResult[];
  failedTasks: TaskCreationResult[];
};

type BatchedResult = { task: Required<TaskData>; row: number };

interface ITaskProcessor {
  createTransformStream(): Transform;
  createWriteStream(): Writable;
  getResults(): GetResults;
}

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export class TaskProcessor implements ITaskProcessor {
  private _rowIndex: number = 1; // Skip headers
  private _createdTasks: TaskCreationResult[] = [];
  private _failedTasks: TaskCreationResult[] = [];
  private _batchedTasks: BatchedResult[] = [];

  constructor(
    private _database: IDatabase<DatabaseShape>,
    private readonly _batchSize = 2
  ) {
    this.processBatch = this.processBatch.bind(this);
  }

  private async processBatch() {
    try {
      const tasks = this._batchedTasks.map(({ task }) => task);

      await this._database.insertMany("tasks", tasks);

      const createdTasks = this._batchedTasks.map(({ task, row }) => ({
        message: "Task created successfully",
        task: { id: task.id },
        row,
      }));

      this._createdTasks.push(...createdTasks);

      this._batchedTasks = [];
    } catch (err) {
      const error = err as Error;

      const failedTasks = this._batchedTasks.map(({ row }) => ({
        message: "Task creation failed",
        error: error.message,
        row,
      }));

      this._failedTasks.push(...failedTasks);
    }
  }

  createTransformStream(): Transform {
    const transformStream = new Transform({
      objectMode: true,
      transform: (chunk, _encoding, callback) => {
        const { error, success, data } = createTaskSchema.safeParse(chunk);

        if (!success) {
          const { fieldErrors } = error.flatten();

          transformStream.push({
            message: "Task creation failed",
            error: fieldErrors,
            row: this._rowIndex++,
          });
          callback();

          return;
        }

        const task = new Task(data);

        transformStream.push({ task: task.toJSON(), row: this._rowIndex++ });
        callback();
      },
    });

    return transformStream;
  }

  createWriteStream(): Writable {
    const writeStream = new Writable({
      objectMode: true,
      write: async (chunk, _encoding, callback) => {
        if (chunk.error) {
          this._failedTasks.push(chunk);
          callback();

          return;
        }

        this._batchedTasks.push({
          task: chunk.task,
          row: chunk.row,
        });

        if (this._batchedTasks.length >= this._batchSize) {
          await this.processBatch();
        }

        callback();
      },
      final: async (callback) => {
        if (this._batchedTasks.length) await this.processBatch();

        callback();
      },
    });

    return writeStream;
  }

  getResults() {
    return {
      createdTasks: this._createdTasks,
      failedTasks: this._failedTasks,
    };
  }
}
