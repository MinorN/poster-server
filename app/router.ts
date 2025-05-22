import { Application } from "egg"

export default (app: Application) => {
  const { controller, router } = app

  router.post("/api/users/create", controller.user.createByEmail)
  router.post("/api/users/loginByEmail", controller.user.loginByEmail)
  router.get("/api/users/getUserInfo", controller.user.show)
  router.post("/api/users/genVeriCode", controller.user.sendVerifyCode)
  router.post("/api/users/loginByPhoneNumber", controller.user.loginByCellphone)
  router.get("/api/users/passport/gitee", controller.user.oauth)
  router.get("/api/users/passport/calback", controller.user.oauthByGitee)

  router.post("/api/works/create", controller.work.createWork)
  router.get("/api/works", controller.work.myList)
  router.get("/api/templates", controller.work.templateList)

  router.patch("/api/works/:id", controller.work.update)
  router.delete("/api/works/:id", controller.work.delete)

  router.post("/api/works/publish/:id", controller.work.publishWork)
  router.post(
    "/api/works/publish-template/:id",
    controller.work.publishTemplate
  )

  router.post("/api/utils/upload", controller.utils.uploadToOSS) // 上传单个文件
  router.post("/api/utils/mutipleUpload", controller.utils.uploadMutipleFiles) // 上传多个文件
}
