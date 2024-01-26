import { Request, Response, NextFunction } from "express"
import z from "zod"
import bcrypt from "bcrypt"
import prisma from "../infra/database/prisma.db"
import { logger } from "../infra/logger"
import { BadRequestError } from "../helpers/apiErros"
import { validator } from "../helpers/validator"

const schemaRegisterData = z.object({
  first_name: z
    .string()
    .trim()
    .min(3, { message: "Minimum 3 characters required" }),
  last_name: z
    .string()
    .trim()
    .min(3, { message: "Minimum 3 characters required" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Must be 8 or more characters long" }),
})

export class UserController {
  login = (req: Request, res: Response) => {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    const { data, error } = await validator.handle(schemaRegisterData, req.body)
    const saltRounds = 10

    if (error) {
      next(
        new BadRequestError({
          name: "ERROR_DATA",
          message: error.message,
          codeError: error.code,
        })
      )
      return
    }

    const isExistUser = await prisma.users.findUnique({
      where: { email: data.email },
      select: { email: true },
    })

    if (isExistUser) {
      next(
        new BadRequestError({
          name: "ERROR_DATA",
          message: "User already exists",
          codeError: "exist_user",
        })
      )
      return
    }

    const hashPass = await bcrypt.hash(data.password, saltRounds)

    await prisma.users.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hashPass,
      },
    })

    res.status(201).json({
      message: "register success",
    })
  }
}
