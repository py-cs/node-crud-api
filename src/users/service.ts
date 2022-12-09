import { validate } from "uuid";
import ApiError from "../apiError/apiError";
import { ErrorMessages } from "../apiError/constants";
import { isUser } from "./utils";
import { IUserRepository, IUserService } from "./types";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getAll() {
    return this.userRepository.getAll();
  }

  async getOne(id: string) {
    if (!validate(id)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_ID);
    }
    return this.userRepository.getOne(id);
  }

  async create(user: unknown) {
    if (!isUser(user)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_DATA);
    }
    return this.userRepository.create(user);
  }

  async delete(id: string) {
    if (!validate(id)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_ID);
    }
    return this.userRepository.delete(id);
  }

  async update(id: string, user: unknown) {
    if (!validate(id)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_ID);
    }
    if (!isUser(user)) {
      throw ApiError.badRequest(ErrorMessages.INVALID_DATA);
    }
    return this.userRepository.update(id, user);
  }
}
