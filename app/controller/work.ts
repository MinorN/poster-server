import { Controller } from "egg"
import validateInput from "app/decorator/inputValidate"

const wortCreateRules = {
  title: "string",
}

export interface IndexCondition {
  pageIndex?: number
  pageSize?: number
  select?: string | string[]
  populate?: { path: string; select: string }
  customSort?: Record<string, any>
  find?: Record<string, any>
}

export default class WorkController extends Controller {
  @validateInput(wortCreateRules, "workValidateFail")
  async createWork() {
    const { ctx, service } = this
    const workData = await service.work.createEmptyWork(ctx.request.body)
    ctx.helper.success({ ctx, res: workData })
  }

  // 查询自己的作品
  async myList() {
    const { ctx, service } = this
    const userId = ctx.state.user._id
    const { pageIndex, pageSize, isTemplate, title } = ctx.query
    const findCondition = {
      user: userId,
      ...(title && { title: { $regex: title, $options: "i" } }),
      ...(isTemplate && { isTemplate: !!parseInt(isTemplate) }),
    }
    const listCondition: IndexCondition = {
      select: "id author copiedCount coverImg desc title user isHot createdAt",
      populate: { path: "user", select: "username nickName picture" },
      find: findCondition,
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    }
    const res = await service.work.getList(listCondition)
    ctx.helper.success({ ctx, res })
  }

  // 查询自己的模板
  async templateList() {
    const { ctx, service } = this
    const { pageIndex, pageSize } = ctx.query

    const listCondition: IndexCondition = {
      select: "id author copiedCount coverImg desc title user isHot createdAt",
      populate: { path: "user", select: "username nickName picture" },
      find: { isPublic: true, isTemplate: true },
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    }
    const res = await service.work.getList(listCondition)
    ctx.helper.success({ ctx, res })
  }
}
