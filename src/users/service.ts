import { userRepository } from "./repository";

export const userService = {
  async getAll() {
    const users = await userRepository.getAll();
    return users;
  },

  async getOne(id: string) {
    const users = await userRepository.getOne(id);
    return users;
  },
};
