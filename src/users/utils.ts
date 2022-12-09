import cluster from "cluster";
import { IncomingMessage } from "http";
import ApiError from "../apiError/apiError";
import { ErrorMessages } from "../apiError/constants";
import { User } from "./types";

export const getId = (url: string) => {
  const groups = url.match(/\/api\/users\/([\w-]+)/);
  return groups ? groups[1] : null;
};

export const getBody = async (request: IncomingMessage): Promise<{}> => {
  return new Promise((resolve, reject) => {
    const buff: Uint8Array[] = [];
    request
      .on("data", (chunk: Uint8Array) => {
        buff.push(chunk);
      })
      .on("end", () => {
        const body = Buffer.concat(buff).toString().trim();
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          reject(ApiError.badRequest(ErrorMessages.INVALID_DATA));
        }
      })
      .on("error", () => {
        reject();
      });
  });
};

export const isUser = (obj: Partial<User>): obj is User => {
  return (
    typeof obj.userName === "string" &&
    typeof obj.age === "number" &&
    Array.isArray(obj.hobbies) &&
    obj.hobbies.every((h) => typeof h === "string")
  );
};

export const getProcessStatus = () =>
  process.env.CRUD_API_MODE === "cluster"
    ? cluster.isPrimary
      ? "Primary"
      : "Worker"
    : "Server";
