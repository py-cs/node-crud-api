import os from "os";
import cluster from "cluster";
import { IncomingMessage, request, ServerResponse } from "http";
import { HOST } from "./constants";
import { UserRepository } from "../users/repository";
import { Message } from "../sharedRepository/messages";
import ApiError from "../apiError/apiError";

export const balancer = (port: number) => {
  const coresCount = os.cpus().length / 2;
  const userRepository = new UserRepository([]);

  const workerPorts = Array(coresCount)
    .fill(null)
    .map((_, index) => {
      const workerPort = port + index + 1;

      const worker = cluster.fork({ workerPort });

      worker.on("message", async (message: Message) => {
        const repoMethod = userRepository[message.action];
        const args = "arguments" in message ? message.arguments : [];

        repoMethod
          .apply(userRepository, args)
          .then((data: ReturnType<typeof repoMethod>) => worker.send({ data }))
          .catch((error: ApiError) => {
            worker.send({ status: error.status, message: error.message });
          });
      });

      return workerPort;
    });

  let nextPortIndex = 0;

  return (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    const port = workerPorts[nextPortIndex++ % coresCount];
    const connector = request(
      {
        host: HOST,
        path: req.url,
        method: req.method,
        headers: req.headers,
        port,
      },
      (response) => {
        res.statusCode = response.statusCode;
        res.setHeader("Content-Type", "application/json");
        response.pipe(res);
      }
    );
    req.pipe(connector);
  };
};
