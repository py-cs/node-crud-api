import { v4 as uuidv4 } from "uuid";
import { ErrorMessages } from "../apiError/constants";
import { User } from "./types";
import ApiError from "../apiError/apiError";

export const users: User[] = [];

export const userRepository = {
  async getAll(): Promise<User[]> {
    return new Promise((resolve) => {
      resolve(users);
    });
  },

  async getOne(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const user = users.find((user) => user.id === id);
      if (user) {
        resolve(user);
      }
      throw ApiError.notFound(ErrorMessages.ID_NOT_FOUND);
    });
  },

  async create(user: User): Promise<User> {
    return new Promise((resolve) => {
      const newUser = { ...user, id: uuidv4() };
      users.push(newUser);
      resolve(newUser);
    });
  },

  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const candidate = users.find((user) => user.id === id);
      if (!candidate) {
        reject(ApiError.notFound(ErrorMessages.ID_NOT_FOUND));
      }
      users.splice(users.indexOf(candidate), 1);
      resolve();
    });
  },

  async update(id: string, user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      const candidate = users.find((user) => user.id === id);
      if (!candidate) {
        reject(ApiError.notFound(ErrorMessages.ID_NOT_FOUND));
      }
      const updatedUser = { ...user, id };
      users.splice(users.indexOf(candidate), 1, updatedUser);
      resolve(updatedUser);
    });
  },
};
