import { Application } from "egg"

export default (app: Application) => {
  const { controller, router } = app
  router.prefix("/api")

  router.post("/users/create", controller.user.createByEmail)
  router.post("/users/loginByEmail", controller.user.loginByEmail)
  router.get("/users/getUserInfo", controller.user.show)
  router.post("/users/genVeriCode", controller.user.sendVerifyCode)
  router.post("/users/loginByPhoneNumber", controller.user.loginByCellphone)
  router.get("/users/passport/gitee", controller.user.oauth)
  router.get("/users/passport/calback", controller.user.oauthByGitee)

  router.post("/works/create", controller.work.createWork)
  router.get("/works", controller.work.myList)
  router.get("/templates", controller.work.templateList)

  router.patch("/works/:id", controller.work.update)
  router.delete("/works/:id", controller.work.delete)

  router.post("/works/publish/:id", controller.work.publishWork)
  router.post("/works/publish-template/:id", controller.work.publishTemplate)

  router.post("/utils/upload", controller.utils.uploadToOSS) // 上传单个文件
  router.post("/utils/mutipleUpload", controller.utils.uploadMutipleFiles) // 上传多个文件

  // ssr
  router.get("/pages/:idAndUuid", controller.utils.renderH5Page)

  router.post("/channel", controller.work.createChannel)
  router.get("/channel/getWorkChannels/:id", controller.work.getWorkChannel)
  router.patch("/channel/updateName/:id", controller.work.updateChannelName)
  router.delete("/channel/:id", controller.work.deleteChannel)
}
