import jwtAsync from "./jwt-async"
import { randomUUID } from "crypto"
// informações para o refreshToken |-> userId, rfTokenId, nameUser
// informações accessToken |-> rfTokenId, accessID, permissoes

class AuthToken {
  protected token_id: string = randomUUID()
  protected expiresIn: string = process.env.EXPIRES_IN_RFTOKEN as string
  protected jwt_secret: string = process.env.SECRET_KEY_JWT as string
}

<<<<<<< HEAD
class RefreshToken extends AuthToken {
  public generateToken = async (userId: string, nameUser?: string) => {
    const { token, exp } = await jwtAsync.signTokenAsync(
=======
interface iAuthToken {
  generateToken: (userId: string, nameUser?: string) => Promise<string>
  validToken: (token: string) => Promise<RefreshTokenType | undefined>
}

class RefreshToken implements iAuthToken {
  public generateToken = async (userId: string, nameUser?: string) => {
    const token = jwtAsync.signTokenAsync(
>>>>>>> parent of e94f16c (integração com o redis para armazenamento do refresh token  e criação da rota de login)
      { name: nameUser },
      this.jwt_secret,
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

      if (decoded.sub && decoded.exp && decoded.jti) {
        return {
          id: decoded.jti,
          userId: decoded.sub,
          exp: decoded.exp,
        }
      }
    } catch (error) {}
  }
}

class AccessToken extends AuthToken {
  public generateToken = async (
    refreshTokenId: string,
    nameUser: string,
    role?: string
  ) => {
    const { token } = await jwtAsync.signTokenAsync(
      { name: nameUser, role: role },
      this.jwt_secret,
      {
        expiresIn: this.expiresIn,
        subject: refreshTokenId,
      }
    )

    return { token }
  }

  public validToken = async (token: string) => {
    try {
      const decoded = await jwtAsync.verifyTokenAsync(
        token,
        process.env.SECRET_KEY_JWT as string
      )

      if (decoded.sub && decoded.exp) {
        return {
          refreshTokenId: decoded.sub,
          exp: decoded.exp,
        }
      }
    } catch (error) {}
  }
}

const refreshToken = new RefreshToken()
const accessToken = new AccessToken()
export { refreshToken, accessToken }
