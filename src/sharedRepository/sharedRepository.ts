import ApiError from "../apiError/apiError";
import { Deleted, IUserRepository, User } from "../users/types";
import {
  createMessage,
  deleteMessage,
  getAllMessage,
  getOneMessage,
  MessageResponse,
  updateMessage,
} from "./messages";

const MESSAGE = "message";

export class UserSharedRepository implements IUserRepository {
  constructor() {}

  async getAll(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      process.send(getAllMessage());
      process.once(MESSAGE, this.handleResponse<User[]>(resolve, reject));
    });
  }

  async getOne(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      process.send(getOneMessage(id));
      process.once(MESSAGE, this.handleResponse<User>(resolve, reject));
    });
  }

  async create(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      process.send(createMessage(user));
      process.once(MESSAGE, this.handleResponse<User>(resolve, reject));
    });
  }

  async delete(id: string): Promise<Deleted> {
    return new Promise((resolve, reject) => {
      process.send(deleteMessage(id));
      process.once(MESSAGE, this.handleResponse<Deleted>(resolve, reject));
    });
  }

  async update(id: string, user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      process.send(updateMessage(id, user));
      process.once(MESSAGE, this.handleResponse<User>(resolve, reject));
    });
  }

  private handleResponse<T>(
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void
  ) {
    return (response: MessageResponse<T>) => {
      if (response.data) {
        resolve(response.data);
      } else {
        reject(ApiError.notFound(response.message));
      }
    };
  }
}
