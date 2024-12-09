import type { IncomingMessage } from "node:http";

export async function body(req: IncomingMessage) {
  const chunks: Uint8Array[] = [];

  const bodyPromise = new Promise<void>((resolve, reject) => {
    req
      .on("data", (chunk) => {
        chunks.push(chunk);
      })
      .on("end", () => {
        if (chunks.length === 0) return resolve();

        const bodyString = Buffer.concat(chunks).toString();
        const body = JSON.parse(bodyString);

        req.body = body;

        return resolve();
      })
      .on("error", (error) => {
        return reject(error);
      });
  });

  const body = await bodyPromise;

  return body;
}
