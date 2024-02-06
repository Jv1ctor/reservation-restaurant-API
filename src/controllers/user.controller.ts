import { Request, Response, NextFunction } from "express"
import { logger } from "../infra/logger"
import { BadRequestError, UnauthorizedError } from "../helpers/apiErros"
import userService, { ErrorUserService } from "../services/user.service"

export class UserController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    const loginService = await userService.login(req.body)

    if (loginService instanceof Error) return next(loginService)

    if (
      loginService?.error_name === ErrorUserService.INVALID_DATA ||
      loginService?.error_name === ErrorUserService.CREDENCIALS_ERROR
    ) {
      next(
        new BadRequestError({
          message: loginService.error.message,
          codeError: loginService.error.code,
        })
      )
      return
    }

    loginService?.success &&
      res
        .status(200)
        .json({ message: "login successs", token: loginService.token })
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const registerService = await userService.register(req.body)

    if (registerService instanceof Error) return next(registerService)

    if (
      registerService?.error_name === ErrorUserService.INVALID_DATA ||
      registerService?.error_name === ErrorUserService.EXIST_USER
    ) {
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
    const authToken = req.headers.authorization
    const rfTokenService =
      authToken && (await userService.refreshToken(authToken))

    if (rfTokenService instanceof Error) return next(rfTokenService)

    if (
      rfTokenService &&
      (rfTokenService?.error_name === ErrorUserService.INVALID_TOKEN ||
        rfTokenService?.error_name === ErrorUserService.NOT_EXIST_USER)
    ) {
      next(
        new UnauthorizedError({
          message: rfTokenService.error.message,
          codeError: rfTokenService.error.code,
        })
      )
      return
    }

    if (rfTokenService && rfTokenService.success) {
        res.status(200).json({
          message: "refresh token success",
          token: rfTokenService.token,
        })
    }
  }
}
