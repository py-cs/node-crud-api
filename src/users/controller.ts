import { IncomingMessage, ServerResponse } from "http";
import { userService } from "./service";
import { getBody, getId } from "./utils";

export const enum HTTPCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

const sendResponse = <T>(
  res: ServerResponse<IncomingMessage>,
  data: T,
  status: HTTPCodes = HTTPCodes.OK
) => {
  res.statusCode = status;
  res.end(JSON.stringify(data));
};

export const userController = {
  async getAll(_: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const users = await userService.getAll();
    sendResponse(res, users);
  },

  async getOne(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const id = getId(req.url);
    const user = await userService.getOne(id);
    sendResponse(res, user);
  },

  async create(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const body = await getBody(req);
    const newUser = await userService.create(body);
    sendResponse(res, newUser, HTTPCodes.CREATED);
  },

  async delete(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const id = getId(req.url);
    const deleted = await userService.delete(id);
    sendResponse(res, deleted, HTTPCodes.NO_CONTENT);
  },

  async update(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const id = getId(req.url);
    const body = await getBody(req);
    const updatedUser = await userService.update(id, body);
    sendResponse(res, updatedUser);
  },
};
