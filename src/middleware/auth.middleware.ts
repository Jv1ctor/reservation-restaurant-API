import { Request, Response, NextFunction } from "express"
import authTokens from "../helpers/authTokens"
import prisma from "../infra/database/prisma.db"
import { UnauthorizedError } from "../helpers/apiErros"
import { logger } from "../infra/logger"

class Auth {
  private validatorAuth = (auth?: string) => {
    if (auth) {
      const [authCode, token] = auth.split(" ")

      return {
        authCode: authCode === "Bearer" && authCode,
        token,
      }
    }
  }

  public authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const auth = this.validatorAuth(req.headers.authorization)

    if (auth && auth.authCode && auth.token) {
      const decoded = await authTokens.verifyToken(auth.token)

      if (decoded.success && decoded.tokenType === "ACCESS_TOKEN") {
        const user = await prisma.users.findUnique({
          where: { id: decoded.userId, AND: { email: decoded.email } },
          select: {
            logged: true,
            email: true,
            first_name: true,
            last_name: true,
            id: true,
            role: true,
          },
        })
        
        if (user && user.logged) {
          req.user = user
          next()
          return
        }
      }
    }

    return next(
      new UnauthorizedError({
        codeError: "invalid_token",
        message: "invalid token",
      })
    )
  }

  public authorization = async () => {}
}

export default new Auth()
