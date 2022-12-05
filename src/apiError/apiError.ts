enum ErrorCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL = 500,
}

const INTERNAL_MESSAGE = 'Unexpected error'

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
    return new ApiError(ErrorCodes.INTERNAL, INTERNAL_MESSAGE);
  }
}

export default ApiError;
