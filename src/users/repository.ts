import { v4 as uuidv4 } from "uuid";
import { ErrorMessages } from "../apiError/constants";
import { IUserRepository, User } from "./types";
import ApiError from "../apiError/apiError";

export class UserRepository implements IUserRepository {
  constructor(private users: User[]) {}

  async getAll(): Promise<User[]> {
    return new Promise((resolve) => {
      resolve(this.users);
    });
  }

  async getOne(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const user = this.users.find((user) => user.id === id);
      if (user) {
        resolve(user);
      }
      reject(ApiError.notFound(ErrorMessages.ID_NOT_FOUND));
    });
  }

  async create(user: User): Promise<User> {
    return new Promise((resolve) => {
      const newUser = { ...user, id: uuidv4() };
      this.users.push(newUser);
      resolve(newUser);
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const candidate = this.users.find((user) => user.id === id);
      if (!candidate) {
        reject(ApiError.notFound(ErrorMessages.ID_NOT_FOUND));
      }
      this.users.splice(this.users.indexOf(candidate), 1);
      resolve();
    });
  }

  async update(id: string, user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      const candidate = this.users.find((user) => user.id === id);
      if (!candidate) {
        reject(ApiError.notFound(ErrorMessages.ID_NOT_FOUND));
      }
      const updatedUser = { ...user, id };
      this.users.splice(this.users.indexOf(candidate), 1, updatedUser);
      resolve(updatedUser);
    });
  }
}
