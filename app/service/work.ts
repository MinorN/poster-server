import { Service } from "egg"
import { WorkProps } from "../model/work"
import { nanoid } from "nanoid"
import { Types } from "mongoose"

export default class WorkService extends Service {
  async createEmptyWork(playload) {
    const { ctx } = this
    const { username, _id } = ctx.state.user
    // 生成一个id
    const uuid = nanoid(6)

    const newEmptyWork: Partial<WorkProps> = {
      ...playload,
      user: new Types.ObjectId(_id),
      author: username,
      uuid,
    }
    return ctx.model.Work.create(newEmptyWork)
  }
}
