import type { IncomingMessage } from "node:http";

export async function body(req: IncomingMessage) {
  const chunks: Uint8Array[] = [];

  const bodyPromise = new Promise<void>((resolve, reject) => {
    req
      .on("error", (error) => {
        return reject(error);
      })
      .on("data", (chunk) => {
        chunks.push(chunk);
      })
      .on("end", () => {
        try {
          if (chunks.length === 0) return resolve();

          let body = Buffer.concat(chunks).toString();

          const headers = new Map(Object.entries(req.headers));
          const contentType = headers.get("content-type");

          if (contentType === "application/json") body = JSON.parse(body);

          req.body = body;

          return resolve();
        } catch (error) {
          return reject(error);
        }
      });
  });

  const body = await bodyPromise;

  return body;
}
