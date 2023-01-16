import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { server } from "../../src";
import { ErrorMessages } from "../../src/apiError/constants";
import {
  getInvalidEndpointMessage,
  getIdNotFoundMessage,
} from "../../src/apiError/errorMessages";
import { HTTPMethods } from "../../src/router/constants";
import { HTTPCodes, User } from "../../src/users/types";

describe("Users API", () => {
  afterAll((done) => {
    server.close();
    done();
  });

  describe("scenario 1: CRUD operations with correct data", () => {
    it("should return empty list of users", async () => {
      await request(server).get("/api/users").expect(HTTPCodes.OK, []);
    });

    it("should create new user", async () => {
      const testUserData: User = {
        username: "John",
        age: 20,
        hobbies: [],
      };
      const createResponse = await request(server)
        .post("/api/users")
        .send(testUserData);

      expect(createResponse.statusCode).toBe(HTTPCodes.CREATED);
      const createdUser = createResponse.body;
      expect(createdUser).toEqual({ ...testUserData, id: createdUser.id });

      await request(server)
        .get("/api/users")
        .expect(HTTPCodes.OK, [createdUser]);
    });

    it("should return list with one user after user creation", async () => {
      const allUsersResponse = await request(server).get("/api/users");
      expect(allUsersResponse.statusCode).toBe(HTTPCodes.OK);
      expect(allUsersResponse.body).toHaveLength(1);
    });

    it("should get user by id", async () => {
      const allUsersResponse = await request(server).get("/api/users");
      const [user] = allUsersResponse.body;
      const { id } = user;

      await request(server).get(`/api/users/${id}`).expect(HTTPCodes.OK, user);
    });

    it("should update user", async () => {
      const updatedUserData: User = {
        username: "John",
        age: 20,
        hobbies: ["new hobby"],
      };

      const allUsersResponse = await request(server).get("/api/users");
      const [user] = allUsersResponse.body;
      const { id } = user;

      const updateUserResponse = await request(server)
        .put(`/api/users/${id}`)
        .send(updatedUserData);

      expect(updateUserResponse.statusCode).toBe(HTTPCodes.OK);
      const updatedUser = updateUserResponse.body;
      expect(updatedUser).toEqual({ ...updatedUserData, id });
    });

    it("should delete user", async () => {
      const allUsersResponse = await request(server).get("/api/users");
      const [user] = allUsersResponse.body;
      const { id } = user;

      const deleteResponse = await request(server).delete(`/api/users/${id}`);

      expect(deleteResponse.statusCode).toBe(HTTPCodes.NO_CONTENT);
    });

    it("should return empty list of users after user was deleted", async () => {
      await request(server).get("/api/users").expect(HTTPCodes.OK, []);
    });
  });

  describe("scenario 2: handling invalid data", () => {
    const validId = uuidv4();

    it("should return 404 when requesting endpoint that doesn't exist", async () => {
      const invalidEndpoint = "/api/not-exist";
      await request(server)
        .get(invalidEndpoint)
        .expect(HTTPCodes.NOT_FOUND, {
          message: getInvalidEndpointMessage(HTTPMethods.GET, invalidEndpoint),
        });
    });

    it("should return 404 when requesting unavailable method", async () => {
      await request(server)
        .patch("/api/users")
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.NO_METHOD });
    });

    it("should return 400 when getting user by invalid id", async () => {
      await request(server)
        .get("/api/users/invalid-id")
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.INVALID_ID });
    });

    it("should return 404 when getting user by id that doesn't exist", async () => {
      await request(server)
        .get(`/api/users/${validId}`)
        .expect(HTTPCodes.NOT_FOUND, {
          message: getIdNotFoundMessage(validId),
        });
    });

    it("should return 400 when trying to delete user by invalid id", async () => {
      await request(server)
        .delete("/api/users/invalid-id")
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.INVALID_ID });
    });

    it("should return 404 when trying to delete user that doesn't exist", async () => {
      await request(server)
        .delete(`/api/users/${validId}`)
        .expect(HTTPCodes.NOT_FOUND, {
          message: getIdNotFoundMessage(validId),
        });
    });

    it("should return 400 when trying to update user by invalid id", async () => {
      await request(server)
        .put("/api/users/invalid-id")
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.INVALID_ID });
    });

    it("should return 404 when trying to update user that doesn't exist", async () => {
      const userData: User = {
        username: "John",
        age: 20,
        hobbies: [],
      };
      await request(server)
        .put(`/api/users/${validId}`)
        .send(userData)
        .expect(HTTPCodes.NOT_FOUND, {
          message: getIdNotFoundMessage(validId),
        });
    });

    it("should return 400 when trying to create user with invalid data", async () => {
      const invalidUserData = {
        userName: "John",
        age: 20,
      };
      await request(server)
        .post("/api/users")
        .send(invalidUserData)
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.INVALID_DATA });
    });

    it("should return 400 when trying to update user with invalid data", async () => {
      const invalidUserData = {
        userName: "John",
        age: 20,
      };
      await request(server)
        .put(`/api/users/${validId}`)
        .send(invalidUserData)
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.INVALID_DATA });
    });
  });

  describe("scenario 3: handling invalid data corner cases", () => {
    const validId = uuidv4();

    it("should handle missing fields in user data", async () => {
      const noUserName = {
        age: 20,
        hobbies: ["no hobby"],
      };
      await request(server)
        .post("/api/users")
        .send(noUserName)
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.INVALID_DATA });

      const noAge = {
        userName: "Jonh",
        hobbies: ["no hobby"],
      };
      await request(server)
        .post("/api/users")
        .send(noAge)
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.INVALID_DATA });

      const noHobbies = {
        userName: "Jonh",
        age: 20,
      };
      await request(server)
        .post("/api/users")
        .send(noHobbies)
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.INVALID_DATA });
    });

    it("should handle wrong data types in user data", async () => {
      const invalidUserName = {
        userName: 1,
        age: 20,
        hobbies: ["no hobby"],
      };
      await request(server)
        .post("/api/users")
        .send(invalidUserName)
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.INVALID_DATA });

      const invalidAge = {
        userName: "Jonh",
        age: "20",
        hobbies: ["no hobby"],
      };
      await request(server)
        .post("/api/users")
        .send(invalidAge)
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.INVALID_DATA });

      const invalidHobbies = {
        userName: "Jonh",
        age: 20,
        hobbies: { hobby: 0 },
      };
      await request(server)
        .post("/api/users")
        .send(invalidHobbies)
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.INVALID_DATA });
    });

    it("should handle wrong data types in nested data", async () => {
      const invalidHobbies = {
        userName: "Jonh",
        age: 20,
        hobbies: [1, 2, 3],
      };
      await request(server)
        .post("/api/users")
        .send(invalidHobbies)
        .expect(HTTPCodes.BAD_REQUEST, { message: ErrorMessages.INVALID_DATA });
    });
  });
});
