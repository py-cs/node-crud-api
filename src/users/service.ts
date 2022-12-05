import { userRepository } from "./repository";

export const userService = {
  async getAll() {
    const users = await userRepository.getAll();
    return users;
  },
};
