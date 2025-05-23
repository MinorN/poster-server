import { AbilityBuilder, Ability } from "@casl/ability"
import { Document } from "mongoose"
import { UserProps } from "../model/user"

export default function defineRoles(
  user: UserProps & Document<any, any, UserProps>
) {
  const { can, build } = new AbilityBuilder(Ability)

  // 登录使用
  if (user) {
    if (user.role === "admin") {
      can("manage", "all") // 管理员拥有所有权限
    } else {
      // normal
      // users 读取自己的信息、更新部分信息
      can("read", "User", { _id: user._id })
      can("update", "User", ["nickname", "picture"], { _id: user._id }) // 只能更新自己的信息
      // works 创建、读取、更新、删除自己的作品
      can("create", "Work", ["title", "desc", "content", "coverImg"])
      can("read", "Work", { user: user._id })
      can("update", "Work", ["title", "desc", "content", "coverImg"], {
        user: user._id,
      })
      can("delete", "Work", {
        user: user._id,
      })
      can("publish", "Work", { user: user._id })
      // channels 创建、读取、更新、删除自己
      can("create", "Channel", ["name", "workId"], { user: user._id })
      can("read", "Channel", { user: user._id })
      can("update", "Channel", ["name"], { user: user._id })
      can("delete", "Channel", ["name"], { user: user._id })
    }
  }

  return build()
}
