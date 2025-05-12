import { Controller } from "egg"

const userCreateRules = {
  username: "email",
  password: { type: "password", min: 8 },
}

export default class UserController extends Controller {
  async createByEmail() {
    const { ctx, service } = this
    ctx.validate(userCreateRules)
    const userData = await service.user.createByEmail(ctx.request.body)
    ctx.helper.success({ ctx, res: userData })
  }
  async show() {
    const { ctx, service } = this
    if (ctx.params && ctx.params.id) {
      const userData = await service.user.findById(ctx.params.id)
      ctx.helper.success({ ctx, res: userData })
    }
  }
}
