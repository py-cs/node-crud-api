import { validate } from "uuid";
import ApiError from "../apiError/apiError";
import { userRepository } from "./repository";
import { ErrorMessages } from "../apiError/constants";
import { isUser } from "./utils";

export const userService = {
  async getAll() {
    return userRepository.getAll();
  },

  async getOne(id: string) {
    if (!validate(id)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_ID);
    }
    return userRepository.getOne(id);
  },

  async create(user: unknown) {
    if (!isUser(user)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_DATA);
    }
    return userRepository.create(user);
  },

  async delete(id: string) {
    if (!validate(id)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_ID);
    }
    return userRepository.delete(id);
  },

  async update(id: string, user: unknown) {
    if (!validate(id)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_ID);
    }
    if (!isUser(user)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_DATA);
    }
    return userRepository.update(id, user);
  },
};
