import { Request, Response, NextFunction } from "express"
import { logger } from "../infra/logger"
import { BadRequestError } from "../helpers/apiErros"
import userService, { ErrorUserService } from "../services/user.service"

export class UserController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    const loginService = await userService.login(req.body)

    if (loginService instanceof Error) return next(loginService)

    if (loginService?.error_name === ErrorUserService.INVALID_DATA) {
      next(
        new BadRequestError({
          message: loginService.error.message,
          codeError: loginService.error.code,
        })
      )
      return
    }

    if (loginService?.error_name === ErrorUserService.CREDENCIALS_ERROR) {
      next(
        new BadRequestError({
          message: loginService.error.message,
          codeError: loginService.error.code,
        })
      )
      return
    }


    loginService?.success && 
      res.status(200).json({ message: "login successs", token: loginService.token})
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const registerService = await userService.register(req.body)

    if (registerService instanceof Error) return next(registerService)

    if (registerService?.error_name === ErrorUserService.INVALID_DATA) {
      next(
        new BadRequestError({
          message: registerService.error.message,
          codeError: registerService.error.code,
        })
      )
      return
    }

    if (registerService?.error_name === ErrorUserService.EXIST_USER) {
      next(
        new BadRequestError({
          message: registerService.error.message,
          codeError: registerService.error.code,
        })
      )
      return
    }

    res.status(201).json({
      message: "register success",
    })
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.headers.authorization
  }
}
