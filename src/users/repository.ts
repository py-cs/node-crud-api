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

  delete(id: string) {
    const candidate = users.find((user) => user.id === id);
    console.log(candidate);
    if (!candidate) {
      return false;
    }
    users.splice(users.indexOf(candidate), 1);
    return true;
  },
};
