import { IncomingMessage } from "http";
import { User } from "./types";

export const getId = (url: string) => {
  const groups = url.match(/\/api\/users\/([\w-]+)/);
  return groups ? groups[1] : null;
};

export const getBody = async (req: IncomingMessage): Promise<{}> => {
  return new Promise((resolve) => {
    const buff: Uint8Array[] = [];
    req
      .on("data", (chunk: Uint8Array) => {
        buff.push(chunk);
      })
      .on("end", () => {
        const body = Buffer.concat(buff).toString().trim();
        resolve(body ? JSON.parse(body) : {});
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
