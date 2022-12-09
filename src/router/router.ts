import { IncomingMessage, ServerResponse } from "http";
import { userController } from "../users/controller";
import { ErrorMessages } from "../apiError/constants";
import { API_URL, API_URL_WITH_ID, HTTPMethods } from "./constants";
import ApiError from "../apiError/apiError";

export const router = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  res.setHeader("Content-type", "application/json");

  try {
    const { url, method } = req;

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
