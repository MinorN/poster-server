import { Controller } from "egg"
import validateInput from "app/decorator/inputValidate"

const wortCreateRules = {
  title: "string",
}

export default class WorkController extends Controller {
  @validateInput(wortCreateRules, "workValidateFail")
  async createWork() {
    const { ctx, service } = this
    const workData = await service.work.createEmptyWork(ctx.request.body)
    ctx.helper.success({ ctx, res: workData })
  }
}
