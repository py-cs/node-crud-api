import { userRepository } from "./repository";
import { User } from "./types";

export const userService = {
  async getAll() {
    return userRepository.getAll();
  },

  async getOne(id: string) {
    return userRepository.getOne(id);
  },

  async create(user: User) {
    return userRepository.create(user);
  },

  async delete(id: string) {
    return userRepository.delete(id);
  },

  async update(id: string, user: User) {
    return userRepository.update(id, user);
  },
};
