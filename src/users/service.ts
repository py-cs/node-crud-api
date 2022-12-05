import { userRepository } from "./repository";
import { User } from "./types";

export const userService = {
  async getAll() {
    const users = await userRepository.getAll();
    return users;
  },

  async getOne(id: string) {
    const user = await userRepository.getOne(id);
    return user;
  },

  async create(user: User) {
    const newUser = await userRepository.create(user);
    return newUser;
  },

  async delete(id: string) {
    return await userRepository.delete(id);
  },

  async update(id: string, user: User) {
    return await userRepository.update(id, user);
  },
};
