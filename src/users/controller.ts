import { IncomingMessage, ServerResponse } from "http";
import { userService } from "./service";
import { getBody, getId, isUser } from "./utils";
import { validate } from "uuid";
import { User } from "./types";
import ApiError from "../apiError/apiError";
import { ErrorMessages } from "../apiError/constants";

export enum HTTPCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

export const userController = {
  async getAll(_: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const users = await userService.getAll();
    sendResponse<User[]>(res, users);
  },

  async getOne(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const id = getId(req.url);

    if (!validate(id)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_ID);
    }

    const user = await userService.getOne(id);
    sendResponse(res, user);
  },

  async create(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const body = await getBody(req);

    if (!isUser(body)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_DATA);
    }
    const newUser = await userService.create(body);
    sendResponse(res, newUser, HTTPCodes.CREATED);
  },

  async delete(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const id = getId(req.url);

    if (!validate(id)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_ID);
    }

    const isDeleted = await userService.delete(id);
    sendResponse(res, isDeleted, HTTPCodes.NO_CONTENT);
  },

  async update(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const id = getId(req.url);
    const body = await getBody(req);

    if (!validate(id)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_ID);
    }
    if (!isUser(body)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_DATA);
    }

    const updatedUser = await userService.update(id, body);
    sendResponse(res, updatedUser);
  },
};

const sendResponse = <T>(
  res: ServerResponse<IncomingMessage>,
  data: T,
  status: HTTPCodes = HTTPCodes.OK
) => {
  res.statusCode = status;
  res.end(JSON.stringify(data));
};
