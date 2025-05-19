import { GlobalErrorTypes } from "app/error"
import { Controller } from "egg"
// 用户输入验证
export default function validateInput(rules: any, errorType: GlobalErrorTypes) {
  return function (_prototype, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = function (...args: any[]) {
      const that = this as Controller
      // @ts-ignore
      const { ctx } = that
      ctx.app.validator.validate(rules, ctx.request.body)
      const errors = ctx.app.validator.validate(rules, ctx.request.body)
      if (errors) {
        return ctx.helper.error({
          ctx,
          errorType,
          error: errors,
        })
      }
      return originalMethod.apply(this, args)
    }
  }
}
