import { GlobalErrorTypes } from "app/error"
import { Controller } from "egg"

export default function checkPermission(
  modelName: string,
  errorType: GlobalErrorTypes,
  userKey = "user"
) {
  return function (_prototype, _key, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const that = this as Controller
      // @ts-ignore
      const { ctx } = that
      const { id } = ctx.params
      const keyId = ctx.state[userKey]._id
      const record = await ctx.model[modelName].findOne({ id })
      if (!record || record[userKey].toString() !== keyId) {
        return ctx.helper.error({ ctx, errorType })
      }
      return originalMethod.apply(this, args)
    }
  }
}
