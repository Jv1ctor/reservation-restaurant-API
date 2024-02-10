import { Request, Response, NextFunction } from "express"
import { ApiErrorType } from "../helpers/apiErros"

class ErrorMiddleware {
  error404Middleware = (_req: Request, res: Response) => {
    res.status(404).json("endpoint not found")
  }

  handleErrorMiddleware = (
    err: ApiErrorType,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const statusCode = err.statusCode ?? 500
    const codeError = err.codeError
    const messageError = err.statusCode ? err.message : "Internal Error Server"

    if (codeError) {
      res
        .status(statusCode)
        .json({ code_error: codeError, error: messageError })
      return
    }
    res.status(statusCode).json({ error: messageError })
  }
}

export default new ErrorMiddleware()
