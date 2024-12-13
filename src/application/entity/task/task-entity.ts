import crypto from "node:crypto";

export type TaskData = {
  id?: string;
  title: string;
  description: string;
  created_at?: number;
  completed_at?: number | null;
  updated_at?: number | null;
};

export class Task {
  readonly id: string;
  private _title: string;
  private _description: string;
  readonly created_at: number;
  private _completed_at: number | null;
  private _updated_at: number | null;

  constructor(task: TaskData) {
    this.validate(task);

    const {
      id = crypto.randomUUID(),
      title,
      description,
      created_at = Date.now(),
      completed_at = null,
      updated_at = null,
    } = task;

    this.id = id;
    this._title = title.trim();
    this._description = description.trim();
    this._completed_at = completed_at;
    this.created_at = created_at;
    this._updated_at = updated_at;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get completed_at(): number | null {
    return this._completed_at;
  }

  get updated_at(): number | null {
    return this._updated_at;
  }

  get isCompleted(): boolean {
    return this._completed_at !== null;
  }

  set title(value: string) {
    const trimmed = value.trim();

    if (!trimmed) throw new Error("Title is required");

    this._title = trimmed;
    this.updateTimestamp();
  }

  set description(value: string) {
    const trimmed = value.trim();

    if (!trimmed) throw new Error("Description is required");

    this._description = trimmed;
    this.updateTimestamp();
  }

  complete(): void {
    if (this.isCompleted) return;

    this._completed_at = Date.now();
    this.updateTimestamp();
  }

  uncomplete(): void {
    if (!this.isCompleted) return;

    this._completed_at = null;
    this.updateTimestamp();
  }

  toJSON(): Required<TaskData> {
    return {
      id: this.id,
      title: this._title,
      description: this._description,
      created_at: this.created_at,
      completed_at: this._completed_at,
      updated_at: this._updated_at,
    };
  }

  private validate(task: TaskData): void {
    if (!task.title.trim()) throw new Error("Title is required");

    if (!task.description.trim()) throw new Error("Description is required");
  }

  private updateTimestamp(): void {
    this._updated_at = Date.now();
  }
}
