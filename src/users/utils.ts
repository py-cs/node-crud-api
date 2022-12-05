import { IncomingMessage } from "http";

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
