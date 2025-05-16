import { Context } from "egg"
import { userErrorMessages } from "../controller/user"
import { workErrorMessages } from "app/controller/work"
interface RespType {
  ctx: Context
  res?: any
  msg?: string
}

type ErrorType = keyof (typeof userErrorMessages & typeof workErrorMessages)

interface ErrorRespType {
  ctx: Context
  errorType: ErrorType
  error?: any
}

const globalErrorMessages = {
  ...userErrorMessages,
  ...workErrorMessages,
}

export default {
  success({ ctx, res, msg }: RespType) {
    ctx.body = {
      errno: 0,
      data: res ? res : null,
      message: msg ? msg : "请求成功",
    }
    ctx.status = 200
  },
  error({ ctx, errorType, error }: ErrorRespType) {
    const { message, errno } = globalErrorMessages[errorType]
    ctx.body = {
      errno,
      message,
      ...(error && { error }),
    }
    ctx.status = 200
  },
}
