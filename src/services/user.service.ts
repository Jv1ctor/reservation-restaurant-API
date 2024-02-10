import bcrypt from "bcrypt"
import z from "zod"
import prisma from "../infra/database/prisma.db"
import { validator } from "../helpers/validator"
import authTokens from "../helpers/authTokens"
import serviceErros, { EnumErrosService, returnServiceError } from "../helpers/serviceErros"


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

type returnServiceLoginSuccess = {
  success: true
  refreshToken: string;
  accessToken: string;
}

type returnServiceRegisterSuccess = {
  success: true
}
interface IUserService {
  register: (body: any) => Promise<returnServiceError | returnServiceRegisterSuccess> 
  login: (body: any) => Promise<returnServiceError | returnServiceLoginSuccess>
  refreshToken: (auth: string) => Promise<returnServiceError | returnServiceLoginSuccess>
}

class UserService implements IUserService{
  private invalidDataError = serviceErros.handleError(
    EnumErrosService.INVALID_DATA
  )
  private existUserError = serviceErros.handleError(EnumErrosService.EXIST_USER)
  private unknowError = serviceErros.handleError(EnumErrosService.UNKNOW_ERROR)
  private credencialsError = serviceErros.handleError(
    EnumErrosService.CREDENCIALS_ERROR
  )
  private invalidTokenError = serviceErros.handleError(
    EnumErrosService.INVALID_TOKEN
  )

  register = async (body: any) => {
    try {
      const { data, error } = await validator.handle(schemaRegisterData, body)

      if (error) return this.invalidDataError(error)

      const isExistUser = await prisma.users.findUnique({
        where: { email: data.email },
        select: { email: true },
      })

      if (isExistUser) {
        return this.existUserError({
          message: "User already exists",
          codeError: "exist_user",
        })
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

      return { success: true as const }
    } catch (error) {
      return this.unknowError(error as Error)
    }
  }

  login = async (body: any) => {
    try {
      const { data, error } = await validator.handle(schemaLoginData, body)

      if (error) return this.invalidDataError(error)

      const user = await prisma.users.findUnique({
        where: { email: data.email },
        select: {
          email: true,
          password: true,
          role: true,
          logged: true,
          id: true,
        },
      })
      const validatorPass =
        user && (await bcrypt.compare(data.password, user?.password))

      if (!validatorPass) {
        return this.credencialsError({
          codeError: "invalid_credencials",
          message: "invalid credencials",
        })
      }

      const refreshToken = await authTokens.generateToken(
        user.id,
        process.env.EXPIRES_IN_RFTOKEN as string
      )
      const accessToken = await authTokens.generateToken(
        user.id,
        process.env.EXPIRES_IN_ACTOKEN as string,
        {
          admin: user.role === "admin",
          email: user.email,
        }
      )

      if (!user.logged) {
        await prisma.users.update({
          data: { logged: true },
          where: { id: user.id },
        })
      }

      return {
        success: true as const,
        refreshToken,
        accessToken,
      }
    } catch (error) {
      return this.unknowError(error as Error)
    }
  }

  refreshToken = async (auth: string) => {
    try {
      const [authCode, token] = auth.split(" ")

      if (authCode === "Bearer" && token) {
        const decoded = await authTokens.verifyToken(token)

        const user =
          decoded.success &&
          (await prisma.users.findUnique({
            where: { id: decoded.userId },
            select: { logged: true, id: true, role: true, email: true },
          }))

        if (user && user.logged && decoded.tokenType === "REFRESH_TOKEN") {
          const refreshToken = await authTokens.generateToken(
            user.id,
            process.env.EXPIRES_IN_RFTOKEN as string
          )
          const accessToken = await authTokens.generateToken(
            user.id,
            process.env.EXPIRES_IN_ACTOKEN as string,
            {
              admin: user.role === "admin",
              email: user.email,
            }
          )

          return { success: true as const, accessToken, refreshToken }
        }
      }

      return this.invalidTokenError({
        codeError: "invalid_token",
        message: "invalid token",
      })
    } catch (error) {
      return this.unknowError(error as Error)
    }
  }
}

export default new UserService()
