import { Controller } from "egg"

const wortCreateRules = {
  title: "string",
}

export const workErrorMessages = {
  workValidateFail: {
    errno: 102001,
    message: "输入信息验证失败",
  },
}

export default class WorkController extends Controller {
  private validateWorkInput(rules: any) {
    const { ctx } = this
    const errors = ctx.app.validator.validate(rules, ctx.request.body)
    return errors
  }

  async createWork() {
    const { ctx, service } = this
    const errors = this.validateWorkInput(wortCreateRules)
    if (errors) {
      return ctx.helper.error({
        ctx,
        errorType: "workValidateFail",
      })
    }
    const workData = await service.work.createEmptyWork(ctx.request.body)
    ctx.helper.success({ ctx, res: workData })
  }
}
