import { Controller } from "egg"

const userCreateRules = {
  username: "email",
  password: { type: "password", min: 8 },
}

const sendCodeRules = {
  phoneNumber: {
    type: "string",
    format: /^1[3-9]\d{9}$/,
    message: "手机号格式不正确",
  },
}

export default class UserController extends Controller {
  async createByEmail() {
    const { ctx, service } = this
    const errors = await this.validateUserInput(userCreateRules)
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
  async validateUserInput(rules: any) {
    const { ctx } = this
    const errors = ctx.app.validator.validate(rules, ctx.request.body)
    return errors
  }

  async sendVerifyCode() {
    const { ctx } = this
    const errors = await this.validateUserInput(sendCodeRules)
    if (errors) {
      return ctx.helper.error({
        ctx,
        errorType: "cellphoneValidateFail",
        error: errors,
      })
    }
    const { phoneNumber } = ctx.request.body
    // 获取 redis 数据
    const preVeriCode = await ctx.app.redis.get(`phone-${phoneNumber}`)
    if (preVeriCode) {
      return ctx.helper.error({
        ctx,
        errorType: "sendVerifyCodeFrequently",
      })
    }
    // 创建验证码
    const verifyCode = Math.floor(Math.random() * 9000 + 1000).toString() // [1000, 9999]
    await ctx.app.redis.set(`phone-${phoneNumber}`, verifyCode, "EX", 60 * 5) // 5分钟过期
    ctx.helper.success({ ctx, res: { verifyCode } })
  }

  async loginByEmail() {
    const { ctx, service } = this
    // 检查输入
    const errors = await this.validateUserInput(userCreateRules)
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
      { username: user.username, _id: user._id },
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

  async loginByCellphone() {
    const { ctx } = this
    const errors = await this.validateUserInput(sendCodeRules)
    if (errors) {
      return ctx.helper.error({
        ctx,
        errorType: "cellphoneValidateFail",
        error: errors,
      })
    }
    const { phoneNumber, veriCode } = ctx.request.body
    // 检查验证码是否正确
    const preVeriCode = await ctx.app.redis.get(`phone-${phoneNumber}`)
    if (!preVeriCode || preVeriCode !== veriCode) {
      return ctx.helper.error({
        ctx,
        errorType: "loginVeriCodeFail",
      })
    }
    const token = await ctx.service.user.loginByCellphone(phoneNumber)
    ctx.helper.success({ ctx, res: { token } })
  }

  async oauth() {
    const { ctx } = this
    const { cid, redirect_url } = ctx.app.config.giteeOauthConfig
    ctx.redirect(
      `https://gitee.com/oauth/authorize?client_id=${cid}&redirect_uri=${redirect_url}&response_type=code`
    )
  }

  // 通过 gitee 登录
  async oauthByGitee() {
    const { ctx } = this
    const { code } = ctx.request.query
    try {
      const token = await ctx.service.user.loginByGitee(code)
      await ctx.render("success.nj", { token })
      // return ctx.helper.success({
      //   ctx,
      //   res: { token },
      // })
    } catch (e) {
      return ctx.helper.error({
        ctx,
        errorType: "giteeFail",
      })
    }
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
