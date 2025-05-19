import { EggAppConfig, EggAppInfo, PowerPartial } from "egg"
import dotEnv from "dotenv"

dotEnv.config()

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1746512353104_5399"

  // add your egg config in here
  config.middleware = ["customerError"]

  config.security = {
    csrf: {
      enable: false,
    },
  }

  config.view = {
    defaultViewEngine: "nulljucks",
  }

  config.logger = {
    consoleLevel: "DEBUG",
  }

  // change multipart mode to file
  // @see https://github.com/eggjs/multipart/blob/master/src/config/config.default.ts#L104
  config.multipart = {
    mode: "file",
  }

  config.mongoose = {
    url: "mongodb://localhost:27017/poster",
  }

  config.redis = {
    client: {
      port: 6379,
      host: "127.0.0.1",
      password: "",
      db: 0,
    },
  }

  config.bcrypt = {
    saltRounds: 10,
  }
  config.jwt = {
    secret: "1234567890",
  }
  config.cors = {
    origin: "http://localhost:8080",
    allowMethods: "GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH",
  }

  // gitee oauth
  const giteeOauthConfig = {
    cid: process.env.GITEE_CID,
    secret: process.env.GITEE_SECRET,
    redirect_url: "http://localhost:7001/api/users/passport/calback",
    auth_url: "https://gitee.com/oauth/token?grant_type=authorization_code",
    giteeUserAPI: "https://gitee.com/api/v5/user",
  }

  // add your special config in here
  // Usage: `app.config.bizConfig.sourceUrl`
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    giteeOauthConfig,
    H5BaseUrl: "http://localhost:7001/api/pages",
  }

  // the return config will combines to EggAppConfig
  return {
    ...(config as {}),
    ...bizConfig,
  }
}
