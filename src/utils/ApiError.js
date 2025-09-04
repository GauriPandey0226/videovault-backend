class ApiError extends Error {
  constructor(
    message = "Something went wrong ",
    statusCode,
    errors = [],
    stack=""
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;
  if (stack) {
    this.stack = stack;
  } else {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
}
export  { ApiError };