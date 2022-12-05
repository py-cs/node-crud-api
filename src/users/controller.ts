import { IncomingMessage, ServerResponse } from "http";
import { userService } from "./service";

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
  async getOne(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {},
  async create(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {},
  async update(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {},
  async delete(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {},
};
