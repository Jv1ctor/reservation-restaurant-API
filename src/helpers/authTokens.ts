import jwtAsync from "./jwt-async"
import { logger } from "../infra/logger"
import prisma from "../infra/database/prisma.db"
import { randomUUID } from "crypto"
// informações para o refreshToken |-> userId, rfTokenId, nameUser
// informações accessToken |-> rfTokenId, accessID, permissoes

type RefreshTokenType = {
  id: string
  userId: string
  exp: number
  nameUser?: string
}

interface iAuthToken {
  generateToken: (userId: string, nameUser?: string) => Promise<string>
  validToken: (token: string) => Promise<RefreshTokenType | undefined>
}

class RefreshToken implements iAuthToken {
  public generateToken = async (userId: string, nameUser?: string) => {
    const token = jwtAsync.signTokenAsync(
      { name: nameUser },
      process.env.SECRET_KEY_JWT as string,
      {
        subject: userId,
        jwtid: randomUUID(),
        expiresIn: process.env.EXPIRES_IN_RFTOKEN,
      }
    )

    return token
  }

  public validToken = async (token: string) => {
    try {
      const decoded = await jwtAsync.verifyTokenAsync(
        token,
        process.env.SECRET_KEY_JWT as string
      )

      if (decoded.sub && decoded.jti && decoded.exp) {
        const user = await prisma.users.findUnique({
          where: { id: decoded.sub },
          select: { id: true },
        })

        if (user)
          return { userId: decoded.sub, id: decoded.jti, exp: decoded.exp }
      }
    } catch (error) {}
  }
}

const refreshToken = new RefreshToken()

export { refreshToken }