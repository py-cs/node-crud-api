import cluster from "cluster";
import { createServer } from "http";
import { router } from "./router/router";
import { balancer } from "./balancer/balancer";
import "dotenv/config";

const { CRUD_API_MODE } = process.env;
const PORT = Number(process.env.PORT);

const isBalancer = CRUD_API_MODE === "cluster" && cluster.isPrimary;
const processPort = Number(cluster.isPrimary ? PORT : process.env.workerPort);
const processName = cluster.isPrimary ? "Primary" : "Worker";

export const server = createServer(isBalancer ? balancer(processPort) : router);

server.listen(processPort, () => {
  console.log(
    `${processName} #${process.pid} is running on port ${processPort}`
  );
});
