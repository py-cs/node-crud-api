import { IncomingMessage, ServerResponse } from "http";
import { userService } from "./service";
import { getBody, getId, isUser } from "./utils";
import { validate } from "uuid";

export const userController = {
  async getAll(_: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    try {
      const users = await userService.getAll();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(users));
    } catch (error: unknown) {
      console.log(error);
    }
  },

  async getOne(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const id = getId(req.url);

    if (!validate(id)) {
      res.statusCode = 400;
      res.end("userId is not valid");
    }

    const user = await userService.getOne(id);

    if (!user) {
      res.statusCode = 404;
      res.end(`User with id ${id} not found`);
    }

    res.statusCode = 200;
    res.end(JSON.stringify(user));
  },

  async create(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const body = await getBody(req);

    if (isUser(body)) {
      const newUser = await userService.create(body);
      res.statusCode = 201;
      res.end(JSON.stringify(newUser));
    } else {
      res.statusCode = 400;
      res.end("Invalid user data");
    }
  },
  async update(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {},
  async delete(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {},
};
