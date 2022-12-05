import { v4 as uuidv4 } from "uuid";
import ApiError from "../apiError/apiError";
import { User } from "./types";

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
      throw ApiError.notFound(`User with id ${id} not found`);
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
        reject(ApiError.notFound(`User with id ${id} not found`));
      }
      users.splice(users.indexOf(candidate), 1);
      resolve();
    });
  },

  async update(id: string, user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      const candidate = users.find((user) => user.id === id);
      if (!candidate) {
        reject(ApiError.notFound(`User with id ${id} not found`));
      }
      const updatedUser = { ...user, id };
      users.splice(users.indexOf(candidate), 1, updatedUser);
      resolve(updatedUser);
    });
  },
};
