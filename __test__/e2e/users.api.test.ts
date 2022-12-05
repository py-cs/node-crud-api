import request from "supertest";
import { server } from "../../src";

describe("Users API", () => {
  it("should return list of all users", async () => {
    await request(server).get("/api/users").expect(200, []);
  });
});
