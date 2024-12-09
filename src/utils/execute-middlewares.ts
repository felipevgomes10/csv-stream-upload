import type { IncomingMessage, ServerResponse } from "node:http";

type Middleware = (req: IncomingMessage, res: ServerResponse) => Promise<void>;

export function executeMiddlewares(
  req: IncomingMessage,
  res: ServerResponse,
  middlewares: Middleware[]
) {
  const middlewaresPromises = middlewares.map((middleware) => {
    return middleware(req, res);
  });

  return Promise.all(middlewaresPromises);
}
