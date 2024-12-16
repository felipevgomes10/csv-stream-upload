import type { TaskData } from "@/application/entity/task/task-entity";

export type DatabaseShape = {
  tasks: TaskData[];
};

export interface IDatabase<TShape extends Record<string, unknown[]>> {
  select<TTable extends keyof TShape>(
    table: TTable,
    filters?: Partial<TShape[TTable][number]>
  ): Promise<TShape[TTable]>;
  insert<TTable extends keyof TShape>(
    table: TTable,
    data: TShape[TTable][number]
  ): Promise<void>;
  insertMany<TTable extends keyof TShape>(
    table: TTable,
    data: TShape[TTable]
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

    this.isMatch = this.isMatch.bind(this);
  }

  async select<TTable extends keyof DatabaseShape>(
    table: TTable,
    filters: Partial<DatabaseShape[TTable][number]> = {}
  ): Promise<DatabaseShape[TTable]> {
    const data = this._database[table];

    const filteredData = data.filter((item) => this.isMatch(item, filters));

    return filteredData;
  }

  async insert<TTable extends keyof DatabaseShape>(
    table: TTable,
    data: DatabaseShape[TTable][number]
  ): Promise<void> {
    const prevData = this._database[table];

    prevData.push(data as unknown as (typeof prevData)[number]);
  }

  async insertMany<TTable extends keyof DatabaseShape>(
    table: TTable,
    data: DatabaseShape[TTable]
  ): Promise<void> {
    const prevData = this._database[table];

    this._database[table] = [...prevData, ...data];
  }

  async update<TTable extends keyof DatabaseShape>(
    table: TTable,
    data: DatabaseShape[TTable][number],
    filters: Partial<DatabaseShape[TTable][number]> = {}
  ): Promise<void> {
    const prevData = this._database[table];

    const updatedData = prevData.map((item) => {
      const isMatch = this.isMatch(item, filters);

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
      const isMatch = this.isMatch(item, filters);

      return !isMatch;
    });

    this._database[table] = updatedData;
  }

  private isMatch<TTable extends keyof DatabaseShape>(
    data: DatabaseShape[TTable][number],
    filters: Partial<DatabaseShape[TTable][number]>
  ) {
    const isMatch = Object.entries(filters)
      .filter(([, value]) => Boolean(value))
      .every(([key, value]) => {
        const item = data[key as keyof typeof data];
        const filter = value as string;

        if (typeof item === "string") {
          return item.toLowerCase().includes(filter.toLowerCase());
        }

        if (typeof item === "number") {
          return item === Number(filter);
        }

        return (
          item[key as keyof typeof item] ===
          filters[key as keyof typeof filters]
        );
      });

    return isMatch;
  }
}

export const database = new Database();
