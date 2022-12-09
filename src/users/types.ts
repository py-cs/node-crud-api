import { IncomingMessage, ServerResponse } from "http";

export const enum HTTPCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

export interface User {
  id?: string;
  userName: string;
  age: number;
  hobbies: string[];
}

export interface IUserController {
  getAll: (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ) => Promise<void>;
  getOne: (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ) => Promise<void>;
  create: (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ) => Promise<void>;
  delete: (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ) => Promise<void>;
  update: (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ) => Promise<void>;
}

export interface IUserService {
  getAll: () => Promise<User[]>;
  getOne: (id: string) => Promise<User>;
  create: (user: unknown) => Promise<User>;
  delete: (id: string) => Promise<void>;
  update: (id: string, user: unknown) => Promise<User>;
}

export interface IUserRepository {
  getAll: () => Promise<User[]>;
  getOne: (id: string) => Promise<User>;
  create: (user: User) => Promise<User>;
  delete: (id: string) => Promise<void>;
  update: (id: string, user: User) => Promise<User>;
}
