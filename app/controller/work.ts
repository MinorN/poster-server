import { Controller } from "egg"
import validateInput from "app/decorator/inputValidate"
import checkPermission from "app/decorator/checkPermission"

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

  // 查询模板
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

  // 更新
  @checkPermission("Work", "workNoPermissionFail")
  async update() {
    const { ctx } = this
    const { id } = ctx.params
    const payload = ctx.request.body
    const res = await ctx.model.Work.findOneAndUpdate({ id }, payload, {
      new: true,
    }).lean()
    ctx.helper.success({ ctx, res })
  }

  // 删除
  @checkPermission("Work", "workNoPermissionFail")
  async delete() {
    const { ctx } = this
    const { id } = ctx.params
    const res = await ctx.model.Work.findOneAndDelete({ id })
      .select("_id id title")
      .lean()
    ctx.helper.success({ ctx, res })
  }

  // 发布
  @checkPermission("Work", "workNoPermissionFail")
  async publish(isTemplate: boolean) {
    const { ctx, service } = this
    const { id } = ctx.params
    const url = await service.work.publish(id, isTemplate)
    if (!url) {
      return ctx.helper.error({ ctx, errorType: "workNotFound" })
    }
    ctx.helper.success({ ctx, res: { url } })
  }

  async publishWork() {
    await this.publish(false)
  }
  async publishTemplate() {
    await this.publish(true)
  }
}
