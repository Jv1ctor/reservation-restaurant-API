export type ApiErrorType = Error & {
  statusCode?: number
}

class ApiError extends Error {
  public readonly statusCode: number
  constructor(message: string, statusCode: number){
    super(message)
    this.statusCode = statusCode
  }
}

class BadRequestError extends ApiError  {
  constructor(message: string){
    super(message, 400)
  }
}

class UnauthorizedError extends ApiError{
  constructor(message: string){
    super(message, 401)
  }
}

class ForbiddenError extends ApiError{
  constructor(message: string){
    super(message, 403)
  }
}

export { BadRequestError, UnauthorizedError, ForbiddenError}