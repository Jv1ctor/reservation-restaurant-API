export type ApiErrorType = Error & {
  statusCode?: number
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
  constructor({ name, message, codeError }: ApiErrorType) {
    super(name, message, 400, codeError)
  }
}

class UnauthorizedError extends ApiError {
  constructor({ name, message }: ApiErrorType) {
    super(name, message, 401)
  }
}

class ForbiddenError extends ApiError {
  constructor({ name, message }: ApiErrorType) {
    super(name, message, 403)
  }
}

export { BadRequestError, UnauthorizedError, ForbiddenError }
