import { GlobalErrorTypes } from "app/error"
import { Controller } from "egg"
import { subject } from "@casl/ability"
import { permittedFieldsOf } from "@casl/ability/extra"
import { difference, assign } from "lodash/fp"
import defineRoles from "app/roles/roles"

const caslMethodMapping: Record<string, string> = {
  GET: "read",
  POST: "create",
  PATCH: "update",
  DELETE: "delete",
}

const feildsOptions = { fieldsFrom: (rule) => rule.fields || [] }

interface IOptions {
  // 自定义的action
  action?: string
  // 查找操作的参数，默认为 id
  key?: string
  value?: { type: "params" | "body"; valueKey: string }
}

interface ModelMapping {
  mongoose: string
  casl: string
}

const defaultOptions = {
  key: "id", // 查询的参数
  // 查询的参数类型
  // params: ctx.params, body: ctx.request.body
  value: {
    type: "params",
    valueKey: "id",
  },
}
/**
 *
 * @param modelName 模块名
 * @param errorType 错误类型
 * @param options 自定义action和查询条件
 * @returns function
 */
export default function checkPermission(
  modelName: string | ModelMapping,
  errorType: GlobalErrorTypes,
  options?: IOptions
) {
  return function (_prototype, _key, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const that = this as Controller
      // @ts-ignore
      const { ctx } = that
      const { method } = ctx.request
      // 处理modelName
      const mongooseModelName =
        typeof modelName === "string" ? modelName : modelName.mongoose
      const caslModelName =
        typeof modelName === "string" ? modelName : modelName.casl
      const searchOptions = assign(defaultOptions, options || {})
      const { key, value } = searchOptions
      const { type, valueKey } = value
      const source = type === "params" ? ctx.params : ctx.request.body
      const query = {
        [key]: source[valueKey],
      }

      const action =
        options && options.action ? options.action : caslMethodMapping[method]
      if (!ctx.state && !ctx.state.user) {
        return ctx.helper.error({
          ctx,
          errorType,
        })
      }
      let permission = false
      let keyPermission = true
      // 获取roles
      const ability = defineRoles(ctx.state.user)
      const rule = ability.relevantRuleFor(action, caslModelName)
      if (rule && rule.conditions) {
        // 有条件，需要查询
        const certianRecord = await ctx.model[mongooseModelName]
          .findOne(query)
          .lean()
        if (!certianRecord) {
          return ctx.helper.error({
            ctx,
            errorType,
          })
        }
        permission = ability.can(action, subject(caslModelName, certianRecord))
      } else {
        permission = ability.can(action, caslModelName)
      }

      // 判断是否有对应的受限字段
      if (rule && rule.fields) {
        const fields = permittedFieldsOf(
          ability,
          action,
          caslModelName,
          feildsOptions
        )
        if (fields.length > 0) {
          const paloadKeys = Object.keys(ctx.request.body)
          const diffKeys = difference(paloadKeys, fields)
          keyPermission = diffKeys.length === 0
        }
      }

      if (!permission || !keyPermission) {
        return ctx.helper.error({
          ctx,
          errorType,
        })
      }
      await originalMethod.apply(this, args)
    }
  }
}
