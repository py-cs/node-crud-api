import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  userName: string;
  age: number;
  hobbies: string[];
}

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
};
