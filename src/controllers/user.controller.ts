import { Request, Response, NextFunction } from "express"
import { BadRequestError, UnauthorizedError } from "../helpers/apiErros"
import userService from "../services/user.service"

export class UserController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    const loginService = await userService.login(req.body)

    if (!loginService.success) {
      if (loginService.error instanceof Error) return next(loginService.error)

      next(
        new BadRequestError({
          message: loginService.error.message,
          codeError: loginService.error.code,
        })
      )
      return
    }

    res.status(200).json({
      message: "login successs",
      accessToken: loginService.accessToken,
      refreshToken: loginService.refreshToken,
    })
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const registerService = await userService.register(req.body)

    if (!registerService.success) {
      if (registerService.error instanceof Error)
        return next(registerService.error)

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
    const auth = req.headers.authorization

    if (auth) {
      const refreshTokenService = await userService.refreshToken(auth)
      if (!refreshTokenService.success) {
        if (refreshTokenService.error instanceof Error)
          return next(refreshTokenService.error)
        
        next(
          new UnauthorizedError({
            message: refreshTokenService.error.message,
            codeError: refreshTokenService.error.code,
          })
        )
        return
      }

      return res.status(200).json({
        message: "success refresh login",
        accessToken: refreshTokenService.accessToken,
        refreshToken: refreshTokenService.refreshToken,
      })
    }

    next(
      new BadRequestError({
        codeError: "invalid_data",
        message: "invalid data",
      })
    )
  }
}
