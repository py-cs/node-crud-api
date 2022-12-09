import { IUserRepository, User } from "../users/types";
import {
  createMessage,
  deleteMessage,
  getAllMessage,
  getOneMessage,
  MessageResponse,
  updateMessage,
} from "./messages";
import ApiError from "../apiError/apiError";

export class UserSharedRepository implements IUserRepository {
  constructor() {}

  async getAll(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      process.send(getAllMessage());
      process.once("message", (response: MessageResponse<User[]>) => {
        if (response.data) {
          resolve(response.data);
        } else {
          reject(ApiError.notFound(response.message));
        }
      });
    });
  }

  async getOne(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      process.send(getOneMessage(id));
      process.once("message", (response: MessageResponse<User>) => {
        if (response.data) {
          resolve(response.data);
        } else {
          reject(ApiError.notFound(response.message));
        }
      });
    });
  }

  async create(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      process.send(createMessage(user));
      process.once("message", (response: MessageResponse<User>) => {
        if (response.data) {
          resolve(response.data);
        } else {
          reject(ApiError.notFound(response.message));
        }
      });
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      process.send(deleteMessage(id));
      process.once("message", (response: MessageResponse<string>) => {
        if (response.data === "") {
          resolve();
        } else {
          reject(ApiError.notFound(response.message));
        }
      });
    });
  }

  async update(id: string, user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      process.send(updateMessage(id, user));
      process.once("message", (response: MessageResponse<User>) => {
        if (response.data) {
          resolve(response.data);
        } else {
          reject(ApiError.notFound(response.message));
        }
      });
    });
  }
}
