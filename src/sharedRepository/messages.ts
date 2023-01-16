import { User } from "../users/types";

export enum Actions {
  GET_ALL = "getAll",
  GET_ONE = "getOne",
  CREATE = "create",
  DELETE = "delete",
  UPDATE = "update",
}

export const getAllMessage = () => ({
  action: Actions.GET_ALL,
});
export type GetAllMessage = ReturnType<typeof getAllMessage>;

export const getOneMessage = (id: string) => ({
  action: Actions.GET_ONE,
  args: [id],
});
export type GetOneMessage = ReturnType<typeof getOneMessage>;

export const createMessage = (user: User) => ({
  action: Actions.CREATE,
  args: [user],
});
export type CreateMessage = ReturnType<typeof createMessage>;

export const deleteMessage = (id: string) => ({
  action: Actions.DELETE,
  args: [id],
});
export type DeleteMessage = ReturnType<typeof deleteMessage>;

export const updateMessage = (id: string, user: User) => ({
  action: Actions.UPDATE,
  args: [id, user],
});
export type UpdateMessage = ReturnType<typeof updateMessage>;

export type Message =
  | GetAllMessage
  | GetOneMessage
  | CreateMessage
  | DeleteMessage
  | UpdateMessage;

export type MessageValidResponse<T> = {
  data: T;
};

export type MessageErrorResponse = {
  status: number;
  message: string;
};

export type MessageResponse<T> = MessageValidResponse<T> & MessageErrorResponse;
