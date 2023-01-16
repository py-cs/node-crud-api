import { ErrorCodes, ErrorMessages } from "./constants";

class ApiError extends Error {
  constructor(public status: number, public message: string) {
    super();
  }

  static badRequest(message: string) {
    return new ApiError(ErrorCodes.BAD_REQUEST, message);
  }

  static notFound(message: string) {
    return new ApiError(ErrorCodes.NOT_FOUND, message);
  }

  static internal() {
    return new ApiError(ErrorCodes.INTERNAL, ErrorMessages.INTERNAL);
  }
}

export default ApiError;
