export type ApiErrorType = Error & {
  statusCode?: number
  name_error?: string
  codeError?: string
}

type ParamErrorType = {
  name_error: string,
  message: string,
  codeError?: string
}

class ApiError extends Error {
  public readonly name: string
  public readonly statusCode: number
  public readonly codeError?: string
  constructor(
    name: string,
    message: string,
    statusCode: number,
    codeError?: string
  ) {
    super(message)
    this.statusCode = statusCode
    this.name = name
    this.codeError = codeError
  }
}

class BadRequestError extends ApiError {
  constructor({ name_error, message, codeError }: ParamErrorType) {
    super(name_error, message, 400, codeError)
  }
}

class UnauthorizedError extends ApiError {
  constructor({ name_error, message }: ParamErrorType) {
    super(name_error, message, 401)
  }
}

class ForbiddenError extends ApiError {
  constructor({ name_error, message }: ParamErrorType) {
    super(name_error, message, 403)
  }
}

export { BadRequestError, UnauthorizedError, ForbiddenError }
