import { Redis } from "ioredis"
import { logger } from "../logger"

type tokenRedisType = {
  token_id: string
  user_id: string
  token: string
}
class tokenRedis {
  constructor(private key: string, private redis: Redis) {}

  public set = async (userId: string, tokenId: string, expiresIn = 0, token: string) => {
    try {
      const currentDate = Math.floor(new Date().getTime() / 1000)
      const ttl = expiresIn - currentDate

      this.redis.setex(
        `${this.key}:${userId}`,
        ttl,
        JSON.stringify({
          token_id: tokenId,
          token: token
        })
      )
    } catch (err) {
      logger.error(err)
    }
  }

  public get = async (userId: string) => {
    try {
      const token = await this.redis.get(`${this.key}:${userId}`)
      if (token) return JSON.parse(token) as tokenRedisType
    } catch (err) {
      logger.error(err)
    }
  }
}

class ClientRedis extends Redis {
  public refreshToken: tokenRedis
  public accessToken: tokenRedis

  constructor(url: string) {
    super(url)
    this.refreshToken = new tokenRedis("Refresh-Token", this)
    this.accessToken = new tokenRedis("Access-Token", this)

    this.on("connect", () => {
      logger.info("Redis connect...")
    })
    this.on("close", () => {
      logger.warn("Redis connect Closed")
    })
    this.on("error", (err) => {
      logger.error("Redis connect Error", err)
    })


  }
}

const clientRedis = new ClientRedis(process.env.REDIS_URL as string)

export default clientRedis
