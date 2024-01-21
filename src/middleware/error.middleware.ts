import { Request, Response, NextFunction } from "express"
import { ApiErrorType } from "../helpers/apiErros"

class ErrorMiddleware {
  error404Middleware = (_req: Request, res: Response) => {
    res.status(404).json("endpoint not found")
  }  

  handleErrorMiddleware = (err: ApiErrorType, _req: Request , res: Response, next: NextFunction) => {
    const statusCode = err.statusCode ?? 500
    const messageError = err.statusCode ? err.message : "Internal Error Server"
    next(err)
    res.status(statusCode).json({ error: messageError })
  }
}

export default new ErrorMiddleware()