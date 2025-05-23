import { GlobalErrorTypes } from "app/error"
import { Controller } from "egg"
import { subject } from "@casl/ability"
import defineRoles from "app/roles/roles"

const caslMethodMapping: Record<string, string> = {
  GET: "read",
  POST: "create",
  PATCH: "update",
  DELETE: "delete",
}

export default function checkPermission(
  modelName: string,
  errorType: GlobalErrorTypes
) {
  return function (_prototype, _key, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const that = this as Controller
      // @ts-ignore
      const { ctx } = that
      const { id } = ctx.params
      const { method } = ctx.request
      const action = caslMethodMapping[method]
      if (!ctx.state && !ctx.state.user) {
        return ctx.helper.error({
          ctx,
          errorType,
        })
      }
      let permission = false
      // 获取roles
      const ability = defineRoles(ctx.state.user)
      const rule = ability.relevantRuleFor(action, modelName)
      if (rule && rule.conditions) {
        // 有条件，需要查询
        const certianRecord = await ctx.model[modelName].findOne({ id }).lean()
        if (!certianRecord) {
          return ctx.helper.error({
            ctx,
            errorType,
          })
        }
        permission = ability.can(action, subject(modelName, certianRecord))
      } else {
        permission = ability.can(action, modelName)
      }

      if (!permission) {
        return ctx.helper.error({
          ctx,
          errorType,
        })
      }
      await originalMethod.apply(this, args)
    }
  }
}
