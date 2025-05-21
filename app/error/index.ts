import { userErrorMessages } from "./user"
import { utilsErrorMessages } from "./utils"
import { workErrorMessages } from "./work"

export type GlobalErrorTypes = keyof (typeof userErrorMessages &
  typeof workErrorMessages &
  typeof utilsErrorMessages)

export const globalErrorMessages = {
  ...userErrorMessages,
  ...workErrorMessages,
  ...utilsErrorMessages,
}
