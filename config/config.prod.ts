import { EggAppConfig, PowerPartial } from "egg"

export default () => {
  const config = {} as PowerPartial<EggAppConfig>

  config.mongoose = {
    url: "mongodb://poster-mongo:27017/poster",
    options: {
      user: process.env.MONGO_DB_USERNAME,
      pass: process.env.MONGO_DB_PASSWORD,
    },
  }

  config.redis = {
    client: {
      port: 6379,
      host: "poster-redis",
      password: process.env.REDIS_PASSWORD,
      db: 0,
    },
  }

  config.jwtExpiration = "1 days"

  return config
}
