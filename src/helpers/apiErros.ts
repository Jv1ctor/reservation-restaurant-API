export type ApiErrorType = Error & {
  statusCode: number
  codeError?: string
}

export type ParamErrorType = {
  message: string,
  codeError?: string
}

class ApiError extends Error {
  public readonly statusCode: number
  public readonly codeError?: string
  constructor(
    message: string,
    statusCode: number,
    codeError?: string
  ) {
    super(message)
    this.statusCode = statusCode
    this.codeError = codeError
  }
}

class BadRequestError extends ApiError {
  constructor({ message, codeError }: ParamErrorType) {
    super(message, 400, codeError)
  }
}

class UnauthorizedError extends ApiError {
  constructor({ message }: ParamErrorType) {
    super(message, 401)
  }
}

class ForbiddenError extends ApiError {
  constructor({ message }: ParamErrorType) {
    super(message, 403)
  }
}

export { BadRequestError, UnauthorizedError, ForbiddenError }
