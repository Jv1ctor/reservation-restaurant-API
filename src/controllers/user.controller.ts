import { Request, Response, NextFunction } from "express"
import { logger } from "../infra/logger"
import { BadRequestError } from "../helpers/apiErros"
import userService from "../services/user.service"

export class UserController {
  login = async (req: Request, res: Response, next: NextFunction) => {


    res.status(200).json({ message: "login successs" })
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const registerService = await userService.register(req.body)

    if(registerService instanceof Error) return next(registerService)

    if (registerService?.error_name === "INVALID_DATA" && registerService.error) {
      next(
        new BadRequestError({
          name_error: registerService.error_name,
          message: registerService.error.message,
          codeError: registerService.error.code,
        })
      )
      return
    }

    if (registerService?.error_name === "EXIST_USER" && registerService.error) {
      next(
        new BadRequestError({
          name_error: registerService.error_name,
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
}
