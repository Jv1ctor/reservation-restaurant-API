import JWT, { JwtPayload } from "jsonwebtoken"

class JWTAsync {
  signTokenAsync = (
    payload: string | object | Buffer,
    secretOrPrivateKey: JWT.Secret,
    options: JWT.SignOptions
  ) => {
    return new Promise((resolver: (value: string) => void, reject) => {
      JWT.sign(payload, secretOrPrivateKey, options, (err, encoded) => {
        if (err) return reject(err)

        if (encoded) resolver(encoded)
      })
    })
  }
  verifyTokenAsync = (token: string, secretOrPublicKey: JWT.Secret) => {
    return new Promise((resolver: (value: JwtPayload) => void, reject) => {
      JWT.verify(token, secretOrPublicKey, (err, decoded) => {
        if (err) return reject(err)

        if (decoded) resolver(decoded as JwtPayload)
      })
    })
  }
}

export default new JWTAsync()