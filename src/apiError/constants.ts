export const enum ErrorCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL = 500,
}

export enum ErrorMessages {
  INTERNAL = "Unexpected server error",
  NO_ENDPOINT = "Endpoint is not available",
  NO_METHOD = "Method is not supported",
  INVALID_ID = "Invalid user id",
  INVALID_DATA = "Invalid user data",
  ID_NOT_FOUND = "User with this id not found",
}
