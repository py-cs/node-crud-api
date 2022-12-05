import { createServer } from "http";
import { userController } from "./users/controller";
import ApiError from "./apiError/apiError";

const API_URL = /^\/api\/users\/?/;
const API_URL_WITH_ID = /^\/api\/users\/[^\/]*$/;

const server = createServer(async (req, res) => {
  res.setHeader("Content-type", "application/json");

  try {
    const { url, method } = req;

    if (!url.match(API_URL)) {
      throw ApiError.notFound(`Endpoint is not available (${url})`);
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
          throw ApiError.notFound(`${method} method is not supported`);
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

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
