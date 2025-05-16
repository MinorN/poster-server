import { Application } from "egg"

export default (app: Application) => {
  const { controller, router } = app

  router.post("/api/users/create", controller.user.createByEmail)
  router.post("/api/users/loginByEmail", controller.user.loginByEmail)
  router.get("/api/users/current", app.jwt as any, controller.user.show)
  router.post("/api/users/genVeriCode", controller.user.sendVerifyCode)
  router.post("/api/users/loginByPhoneNumber", controller.user.loginByCellphone)
  router.get("/api/users/passport/gitee", controller.user.oauth)
  router.get("/api/users/passport/calback", controller.user.oauthByGitee)
}
