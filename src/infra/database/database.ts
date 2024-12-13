import type { TaskData } from "@/application/entity/task/task-entity";

type DatabaseShape = {
  tasks: TaskData[];
};

interface IDatabase<TShape extends Record<string, unknown[]>> {
  select<TTable extends keyof TShape>(
    table: TTable,
    filters?: Partial<TShape[TTable][number]>
  ): Promise<TShape[TTable]>;
  insert<TTable extends keyof TShape>(
    table: TTable,
    data: TShape[TTable][number]
  ): Promise<void>;
  update<TTable extends keyof TShape>(
    table: TTable,
    data: TShape[TTable][number],
    filters: Partial<TShape[TTable][number]>
  ): Promise<void>;
  delete<TTable extends keyof TShape>(
    table: TTable,
    filters: Partial<TShape[TTable][number]>
  ): Promise<void>;
}

class Database implements IDatabase<DatabaseShape> {
  private _database: DatabaseShape;

  constructor() {
    this._database = { tasks: [] };
  }

  async select<TTable extends keyof DatabaseShape>(
    table: TTable,
    filters: Partial<DatabaseShape[TTable][number]> = {}
  ): Promise<DatabaseShape[TTable]> {
    const data = this._database[table];

    const filteredData = data.filter((item) => {
      const isMatch = Object.keys(filters).every((key) => {
        return (
          item[key as keyof typeof item] ===
          filters[key as keyof typeof filters]
        );
      });

      return isMatch;
    });

    return filteredData;
  }

  async insert<TTable extends keyof DatabaseShape>(
    table: TTable,
    data: DatabaseShape[TTable][number]
  ): Promise<void> {
    const prevData = this._database[table];

    prevData.push(data as unknown as (typeof prevData)[number]);
  }

  async update<TTable extends keyof DatabaseShape>(
    table: TTable,
    data: DatabaseShape[TTable][number],
    filters: Partial<DatabaseShape[TTable][number]> = {}
  ): Promise<void> {
    const prevData = this._database[table];

    const updatedData = prevData.map((item) => {
      const isMatch = Object.keys(filters).every((key) => {
        return (
          item[key as keyof typeof item] ===
          filters[key as keyof typeof filters]
        );
      });

      if (isMatch) return { ...item, ...data };

      return item;
    });

    this._database[table] = updatedData;
  }

  async delete<TTable extends keyof DatabaseShape>(
    table: TTable,
    filters: Partial<DatabaseShape[TTable][number]>
  ): Promise<void> {
    const prevData = this._database[table];

    const updatedData = prevData.filter((item) => {
      const isMatch = Object.keys(filters).every((key) => {
        return (
          item[key as keyof typeof item] ===
          filters[key as keyof typeof filters]
        );
      });

      return !isMatch;
    });

    this._database[table] = updatedData;
  }
}

export const database = new Database();
