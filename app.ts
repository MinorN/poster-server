import { IBoot, Application } from "egg"

export default class AppBoot implements IBoot {
  private readonly app: Application
  constructor(app: Application) {
    this.app = app
  }

  configWillLoad() {
    // 添加 customerError 中间件 解决jwt的错误
    this.app.config.coreMiddleware.push("customerError")
  }
}
