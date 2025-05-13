import { Controller } from "egg"

const userCreateRules = {
  username: "email",
  password: { type: "password", min: 8 },
}

export const userErrorMessages = {
  createUserValidateFail: {
    errno: 101001,
    message: "用户验证失败",
  },
  createUserAlreadyExists: {
    errno: 101002,
    message: "该用户已存在",
  },
}

export default class UserController extends Controller {
  async createByEmail() {
    const { ctx, service } = this
    const errors = ctx.app.validator.validate(userCreateRules, ctx.request.body)
    if (errors) {
      return ctx.helper.error({
        ctx,
        errorType: "createUserValidateFail",
        error: errors,
      })
    }
    const user = await service.user.findByUsername(ctx.request.body.username)
    if (user) {
      return ctx.helper.error({
        ctx,
        errorType: "createUserAlreadyExists",
      })
    }
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
