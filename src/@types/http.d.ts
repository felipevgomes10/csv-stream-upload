type QueryParams = {
  title: string;
  description: string;
};

type RouteParams = {
  id: string;
};

declare module "node:http" {
  interface IncomingMessage {
    params: RouteParams;
    query: QueryParams;
    body?: Record<string, unknown>;
  }
}
