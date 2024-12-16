export type QueryParams = {
  title: string;
  description: string;
};

export type RouteParams = {
  id: string;
};

declare module "node:http" {
  interface IncomingMessage {
    params: RouteParams;
    query: QueryParams;
    body?: unknown;
  }
}

export {};
