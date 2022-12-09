import os from "os";
import cluster from "cluster";
import { IncomingMessage, request, ServerResponse } from "http";
import { CONTENT_TYPE, HOST } from "./constants";

export const balancer = (port: number) => {
  const coresNumber = os.cpus().length;

  const workerPorts = Array(coresNumber)
    .fill(null)
    .map((_, index) => {
      const workerPort = port + index + 1;
      cluster.fork({ workerPort });
      return workerPort;
    });

  let nextPortIndex = 0;

  return (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    const port = workerPorts[nextPortIndex++ % coresNumber];
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
        res.setHeader(CONTENT_TYPE, response.headers[CONTENT_TYPE]);
        response.pipe(res);
      }
    );
    req.pipe(connector);
  };
};
