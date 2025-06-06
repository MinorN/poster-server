import { EggAppConfig, EggAppInfo, PowerPartial } from "egg"
import dotEnv from "dotenv"
import { join } from "path"

dotEnv.config()

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1746512353104_5399"

  // add your egg config in here
  // config.middleware = ["customerError"]

  config.security = {
    csrf: {
      enable: false,
    },
  }

  config.view = {
    defaultViewEngine: "nunjucks",
  }

  config.logger = {
    consoleLevel: "DEBUG",
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
    enable: true,
    secret: process.env.JWT_SECRET || "",
    match: [
      "/api/users/getUserInfo",
      "/api/works",
      "/api/utils/upload",
      "/api/utils/mutipleUpload",
      "/api/channel",
    ],
  }
  config.cors = {
    origin: "http://localhost:8080",
    allowMethods: "GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH",
  }

  config.multipart = {
    mode: "stream",
    whitelist: [".png", ".jpg", ".gif", ".webp"],
    fileSize: "10mb",
  }

  config.static = {
    dir: [
      { prefix: "/public", dir: join(appInfo.baseDir, "app/public") },
      { prefix: "/uploads", dir: join(appInfo.baseDir, "uploads") },
    ],
  }

  // 腾讯云oss
  config.oss = {
    client: {
      SecretId: process.env.COS_SECRET_ID,
      SecretKey: process.env.COS_SECRET_KEY,
    },
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
    baseUrl: "http://localhost:7001",
    giteeOauthConfig,
    H5BaseUrl: "http://localhost:7001/api/pages",
  }

  // the return config will combines to EggAppConfig
  return {
    ...(config as {}),
    ...bizConfig,
  }
}
