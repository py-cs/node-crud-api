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

type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => Promise<void>;

export interface IUserController {
  getAll: RouteHandler;
  getOne: RouteHandler;
  create: RouteHandler;
  delete: RouteHandler;
  update: RouteHandler;
}

export type Deleted = "deleted";

export interface IUserService {
  getAll: () => Promise<User[]>;
  getOne: (id: string) => Promise<User>;
  create: (user: unknown) => Promise<User>;
  delete: (id: string) => Promise<Deleted>;
  update: (id: string, user: unknown) => Promise<User>;
}

export interface IUserRepository {
  getAll: () => Promise<User[]>;
  getOne: (id: string) => Promise<User>;
  create: (user: User) => Promise<User>;
  delete: (id: string) => Promise<Deleted>;
  update: (id: string, user: User) => Promise<User>;
}
