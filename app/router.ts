import { Application } from "egg"

export default (app: Application) => {
  const { controller, router } = app

  router.post("/api/users/create", controller.user.createByEmail)
  router.post("/api/users/login", controller.user.loginByEmail)
  router.get("/api/users/current", app.jwt as any, controller.user.show)
}
