import JWTAsync from "./jwt-async"

type JWTPayloadType = {
  admin?: boolean
  email?: string
}

type returnVerifyToken = {
  success: boolean
  userId?: string
  admin?: boolean
  email?: string
  error?: Error | unknown
}
interface IAuthToken {
  generateToken: (
    userId: string,
    expiresIn: string,
    payload?: JWTPayloadType
  ) => Promise<string>
  verifyToken: (token: string) => Promise<returnVerifyToken>
}

class AuthToken implements IAuthToken {
  private readonly secretJWT = process.env.SECRET_KEY_JWT as string
  private readonly issJWT = process.env.ISS_JWT as string

  public generateToken = (
    userId: string,
    expiresIn: string,
    payload?: JWTPayloadType
  ) => {
    const token = JWTAsync.signTokenAsync(payload || {}, this.secretJWT, {
      expiresIn: expiresIn,
      subject: userId,
      issuer: this.issJWT,
    })

    return token
  }

  public verifyToken = async (token: string) => {
    try {
      const decoded = await JWTAsync.verifyTokenAsync<JWTPayloadType>(
        token,
        this.secretJWT
      )

      if ("admin" in decoded && "email" in decoded) {
        return {
          success: true,
          tokenType: "ACCESS_TOKEN",
          userId: decoded.sub,
          admin: decoded.admin,
          email: decoded.email,
        }
      }
      return { success: true, tokenType: "REFRESH_TOKEN", userId: decoded.sub }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  }
}

export default new AuthToken()
