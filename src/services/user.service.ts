import bcrypt from "bcrypt"
import z, { ZodObject, ZodRawShape } from "zod"
import prisma from "../infra/database/prisma.db"
import { clientRedis } from "../infra/database/redis.db"
import { validator } from "../helpers/validator"
import { refreshToken } from "../helpers/authTokens"

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

const schemaLoginData = schemaRegisterData.pick({ email: true, password: true })

export enum ErrorUserService {
  INVALID_DATA,
  EXIST_USER,
  CREDENCIALS_ERROR,
}

class UserService {
  register = async (body: any) => {
    try {
      const { data, error } = await validator.handle(schemaRegisterData, body)

      if (error) return { error_name: ErrorUserService.INVALID_DATA , error: error }

      const isExistUser = await prisma.users.findUnique({
        where: { email: data.email },
        select: { email: true },
      })

      if (isExistUser)
        return {
          error_name: ErrorUserService.EXIST_USER,
          error: {
            message: "User already exists",
            code: "exist_user",
          },
        }

      const saltRounds = 10
      const hashPass = await bcrypt.hash(data.password, saltRounds)

      await prisma.users.create({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: hashPass,
        },
      })
    } catch (err) {
      if (err instanceof Error) return err
    }
  }

  login = async (body: any) => {
    try {
      const { data, error } = await validator.handle(schemaLoginData, body)
  
      if (error) return { error_name: ErrorUserService.INVALID_DATA, error: error }

      const user = await prisma.users.findUnique({
        where: { email: data.email },
        select: { email: true, password: true, id: true },
      })
      const resultComparePass =
        user && (await bcrypt.compare(data.password, user.password))

      if (!resultComparePass) {
        return {
          error_name: ErrorUserService.CREDENCIALS_ERROR,
          error: {
            message: "username or password is invalid",
            code: "invalid_credentials",
          },
        }
      }

      const {
        id: token_id,
        token,
        exToken,
      } = await refreshToken.generateToken(user.id)
      const existRFToken = await clientRedis.get(`Refresh-Token:${token_id}`)

      if (existRFToken) return { success: true, token: existRFToken }

      // const expires = exToken ? exToken : 0
      const currentDate = Math.floor(new Date().getTime() / 1000)
      const expires = exToken ? exToken - currentDate : 0
      await clientRedis.setex(`Refesh-Token:${token_id}`, expires, token_id)

      return { success: true, token: token }
    } catch (err) {
      if (err instanceof Error) return err
    }
  }
}

export default new UserService()
