import { EggAppConfig, PowerPartial } from "egg"

export default () => {
  const config = {} as PowerPartial<EggAppConfig>

  config.mongoose = {
    url: "mongodb://poster-mongo:27017/poster",
  }

  config.redis = {
    client: {
      port: 6379,
      host: "poster-redis",
      password: "",
      db: 0,
    },
  }

  return config
}
