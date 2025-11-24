import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.SPTFW_REDIS_URL,
  token: process.env.SPTFW_REDIS_TOK,
})

export default redis
