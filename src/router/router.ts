import cluster from "cluster";
import { IncomingMessage, ServerResponse } from "http";
import ApiError from "../apiError/apiError";
import { UserController } from "../users/controller";
import { ErrorMessages } from "../apiError/constants";
import { UserSharedRepository } from "../sharedRepository/sharedRepository";
import { UserRepository } from "../users/repository";
import { UserService } from "../users/service";
import { getProcessStatus } from "../users/utils";
import { API_URL, API_URL_WITH_ID, HTTPMethods } from "./constants";
import { getInvalidEndpointMessage } from "../apiError/errorMessages";

export const router = (processPort: number) => {
  const userRepository = cluster.isWorker
    ? new UserSharedRepository()
    : new UserRepository([]);
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

      if (!url.match(API_URL) && !url.match(API_URL_WITH_ID)) {
        throw ApiError.notFound(getInvalidEndpointMessage(method, url));
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
          if (!url.match(API_URL)) {
            throw ApiError.notFound(getInvalidEndpointMessage(method, url));
          }
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
