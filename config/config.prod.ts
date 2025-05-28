import { EggAppConfig, PowerPartial } from "egg"

export default () => {
  const config = {} as PowerPartial<EggAppConfig>

  config.mongoose = {
    url: "mongodb://poster-mongo:27017/poster",
    options: {
      user: process.env.MONGO_DB_USERNAME,
      pass: process.env.MONGO_DB_PASSWORD,
      useUnifiedTopology: true,
    },
  }

  config.redis = {
    client: {
      port: 6379,
      host: "poster-redis",
      password: process.env.REDIS_PASSWORD,
    },
  }

  // config.jwtExpiration = "1 days"

  // config.security = {
  //   domainWhiteList: ["https://minorn.cn", "https://www.minron.cn"],
  // }

  // config.giteeOauthConfig = {
  //   redirect_url: "https://api.minorn.cn/api/users/passport/gitee/callback",
  // }

  // config.H5BaseURL = "https://h5.minorn.cn"

  return config
}
