import { v4 as uuidv4 } from "uuid";
import { User } from "./types";

const users: User[] = [
  {
    id: uuidv4(),
    userName: "John D",
    age: 22,
    hobbies: [],
  },
];

export const userRepository = {
  getAll() {
    return new Promise((resolve, reject) => {
      resolve(users);
    });
  },
  getOne(id: string) {
    return users.find((user) => user.id === id);
  },
  create(user: User) {
    const newUser = { ...user, id: uuidv4() };
    users.push(newUser);
    return newUser;
  },
};
