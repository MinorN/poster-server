import { Controller } from "egg"

export default class TestController extends Controller {
  async index() {
    const { ctx } = this
    ctx.body = "this is my test"
    const query = ctx.request.query
    ctx.helper.success({ ctx, query })
  }
}
