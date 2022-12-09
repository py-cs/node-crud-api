import cluster from "cluster";
import { createServer } from "http";
import { router } from "./router/router";
import { balancer } from "./balancer/balancer";
import "dotenv/config";
import { UserRepository } from "./users/repository";
import { IUserRepository } from "./users/types";

const { CRUD_API_MODE } = process.env;
const PORT = Number(process.env.PORT);

const isBalancer = CRUD_API_MODE === "cluster" && cluster.isPrimary;
const processPort = Number(cluster.isPrimary ? PORT : process.env.workerPort);
const processName = cluster.isPrimary ? "Primary" : "Worker";

export const server = createServer(
  isBalancer ? balancer(processPort) : router()
);

server.listen(processPort, () => {
  console.log(
    `${processName} #${process.pid} is running on port ${processPort}`
  );
  // console.log(cluster.workers);
});

// if (cluster.isPrimary) {
//   console.log("set up primary listener");
//   server.on("message", (message) => {
//     console.log(message);
//     // @ts-ignore
//     const { from, method, args } = message;
//     type RepoMethod = keyof IUserRepository;
//     const repoMethod = userRepository[method as RepoMethod];
//     // @ts-ignore
//     const repoResponse = repoMethod(...args);
//     cluster.workers[from].send(repoResponse || undefined);
//   });
// }
