import { createServer } from "http";
import { userController } from "./users/controller";
import ApiError from "./apiError/apiError";
import { ErrorMessages } from "./apiError/constants";
import "dotenv/config";

const API_URL = /^\/api\/users\/?/;
const API_URL_WITH_ID = /^\/api\/users\/[^\/]*$/;

export const server = createServer(async (req, res) => {
  res.setHeader("Content-type", "application/json");

  try {
    const { url, method } = req;

    if (!url.match(API_URL)) {
      throw ApiError.notFound(ErrorMessages.NO_ENDPOINT);
    } else {
      switch (method) {
        case "GET":
          if (url.match(API_URL_WITH_ID)) {
            await userController.getOne(req, res);
          } else {
            await userController.getAll(req, res);
          }
          break;
        case "POST":
          await userController.create(req, res);
          break;
        case "PUT":
          await userController.update(req, res);
          break;
        case "DELETE":
          await userController.delete(req, res);
          break;
        default:
          throw ApiError.badRequest(ErrorMessages.NO_METHOD);
      }
    }
  } catch (error) {
    if (!(error instanceof ApiError)) {
      error = ApiError.internal();
    }

    const { status, message } = error;
    res.statusCode = status;
    res.end(JSON.stringify({ message }));
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
