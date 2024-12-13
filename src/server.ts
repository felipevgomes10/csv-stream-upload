import http from "node:http";
import { body } from "./routes/middlewares/body";
import { json } from "./routes/middlewares/json";
import { routes } from "./routes/routes";
import { executeMiddlewares } from "./utils/execute-middlewares";
import { extractQueryParams } from "./utils/extract-query-params";
import { getUrlGroups } from "./utils/get-url-groups";

const PORT = 3333;

const server = http.createServer(async (req, res) => {
  try {
    await executeMiddlewares(req, res, [json, body]);

    const { url, method } = req;

    const route = routes.find((route) => {
      return route.method === method && route.path.test(url as string);
    });

    if (!route) {
      return res.writeHead(404).end(JSON.stringify({ message: "Not found" }));
    }

    const { params, query } = getUrlGroups(url as string, route.path);

    req.params = params;
    req.query = extractQueryParams(query);

    return route.handler(req, res);
  } catch (err) {
    const error = err as Error;

    res.writeHead(500).end(JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
