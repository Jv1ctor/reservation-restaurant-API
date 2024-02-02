import bcrypt from "bcrypt"
import z, { ZodObject, ZodRawShape } from "zod"
import prisma from "../infra/database/prisma.db"
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

const schemaLoginData = schemaRegisterData.pick({ email: true, password: true })

class UserService {

  register = async (body: any) => {
    try {
      const { data, error } = await validator.handle(schemaRegisterData, body)

      if (error) return { error_name: "INVALID_DATA", error: error }

      const isExistUser = await prisma.users.findUnique({
        where: { email: data.email },
        select: { email: true },
      })

      if (isExistUser)
        return {
          error_name: "EXIST_USER",
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
      if(err instanceof Error) return err
    }
  }

  login = () => {}
}




export default new UserService()
