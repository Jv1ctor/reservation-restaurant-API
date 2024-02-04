import { Redis } from "ioredis"

export const clientRedis = new Redis(process.env.REDIS_URL as string)
