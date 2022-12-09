import { IncomingMessage, ServerResponse } from "http";
import { UserController } from "../users/controller";
import { ErrorMessages } from "../apiError/constants";
import { API_URL, API_URL_WITH_ID, HTTPMethods } from "./constants";
import ApiError from "../apiError/apiError";
import cluster from "cluster";
import { UserSharedRepository } from "../sharedRepository/sharedRepository";
import { User } from "../users/types";
import { UserRepository } from "../users/repository";
import { UserService } from "../users/service";
import { getProcessStatus } from "../users/utils";

export const router = (processPort: number) => {
  const userModel: User[] = [];
  const userRepository = cluster.isWorker
    ? new UserSharedRepository()
    : new UserRepository(userModel);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);
  const processStatus = getProcessStatus();

  return async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("Content-Type", "application/json");

    try {
      const { url, method } = req;
      console.log(
        `Executing request: ${method} ${url} --- ${processStatus} #${process.pid} on port ${processPort}`
      );

      if (!url.match(API_URL)) {
        throw ApiError.notFound(ErrorMessages.NO_ENDPOINT);
      }

      switch (method) {
        case HTTPMethods.GET:
          if (url.match(API_URL_WITH_ID)) {
            await userController.getOne(req, res);
          } else {
            await userController.getAll(req, res);
          }
          break;
        case HTTPMethods.POST:
          await userController.create(req, res);
          break;
        case HTTPMethods.PUT:
          await userController.update(req, res);
          break;
        case HTTPMethods.DELETE:
          await userController.delete(req, res);
          break;
        default:
          throw ApiError.badRequest(ErrorMessages.NO_METHOD);
      }
    } catch (error) {
      const { status, message } =
        error instanceof ApiError ? error : ApiError.internal();

      res.statusCode = status;
      res.end(JSON.stringify({ message }));
    }
  };
};
