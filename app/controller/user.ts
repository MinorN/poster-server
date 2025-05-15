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
  loginError: {
    errno: 101003,
    message: "账号名或密码错误",
  },
  loginValidateFail: {
    errno: 101004,
    message: "登录失败",
  },
}

export default class UserController extends Controller {
  async createByEmail() {
    const { ctx, service } = this
    const errors = await this.validateUserInput()
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
  async validateUserInput() {
    const { ctx } = this
    const errors = ctx.app.validator.validate(userCreateRules, ctx.request.body)
    return errors
  }

  async loginByEmail() {
    const { ctx, service } = this
    // 检查输入
    const errors = await this.validateUserInput()
    if (errors) {
      return ctx.helper.error({
        ctx,
        errorType: "createUserValidateFail",
        error: errors,
      })
    }
    const { username, password } = ctx.request.body
    // 检查用户是否存在
    const user = await service.user.findByUsername(username)
    if (!user) {
      return ctx.helper.error({
        ctx,
        errorType: "loginError",
      })
    }
    // 检查密码是否正确
    const valid = await ctx.compare(password, user.password)
    if (!valid) {
      return ctx.helper.error({
        ctx,
        errorType: "loginError",
      })
    }
    const token = ctx.app.jwt.sign(
      { username: user.username },
      ctx.app.config.secret,
      {
        expiresIn: 60 * 60,
      }
    )
    // 登录成功
    ctx.helper.success({
      ctx,
      res: { token },
      msg: "登录成功",
    })
  }

  async show() {
    const { ctx, service } = this
    const userData = await service.user.findByUsername(ctx.state.user.username)
    if (!userData) {
      return ctx.helper.error({
        ctx,
        errorType: "loginValidateFail",
      })
    }
    ctx.helper.success({
      ctx,
      res: userData.toJSON(),
    })
  }
}
