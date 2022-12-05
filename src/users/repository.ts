interface User {
  id: string;
  userName: string;
  age: number;
  hobbies: string[];
}

const users: User[] = [
  {
    id: "1",
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
};
