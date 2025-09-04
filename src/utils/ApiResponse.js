class ApiResponse {
  constructor(status, data = null, error = null) {
    this.status = status;
    this.data = data;
    this.error = error;
  }

  static success(data) {
    return new ApiResponse(200, data);
  }

  static notFound(error) {
    return new ApiResponse(404, null, error);
  }

  static serverError(error) {
    return new ApiResponse(500, null, error);
  }

  static badRequest(error) {
    return new ApiResponse(400, null, error);
  }
}

export { ApiResponse };