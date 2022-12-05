import { createServer, IncomingMessage } from "http";
import { userController } from "./users/controller";

const server = createServer((req, res) => {
  const { url, method } = req;
  console.log(url, method);
  if (!url.match(/\/api\/users/)) {
    res.statusCode = 404;
    res.end("Not  implemented");
  } else {
    switch (method) {
      case "GET":
        if (url.match(/\/api\/users\/([\w-]+)/)) {
          userController.getOne(req, res);
        } else {
          userController.getAll(req, res);
        }
        break;
      case "POST":
        userController.create(req, res);
        break;
      case "PUT":
        userController.update(req, res);
        break;
      case "DELETE":
        userController.delete(req, res);
        break;
      default:
        res.statusCode = 404;
        res.end("Not  implemented");
        break;
    }
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
