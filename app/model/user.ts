import { Application } from "egg"
import AutoIncrementFactory from "mongoose-sequence"

export interface UserProps {
  username: string
  password: string
  email?: string
  nickname?: string
  picture?: string
  phoneNumber?: string
  createdAt: Date
  updatedAt: Date
  type: "email" | "cellphone" | "oauth"
  provider?: "gitee"
  oauthID?: string
  role?: "admin" | "normal"
}

function initUserModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose)
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const UserSchema = new Schema<UserProps>(
    {
      username: { type: String, unique: true, required: true },
      password: { type: String },
      email: { type: String },
      nickname: { type: String },
      picture: { type: String },
      phoneNumber: { type: String },
      type: { type: String, default: "email" },
      provider: { type: String, default: "gitee" }, // gitee
      oauthID: { type: String },
      role: { type: String, default: "normal" }, // normal admin
    },
    {
      timestamps: true,
      toJSON: {
        transform: (_doc, ret) => {
          delete ret.password // 删除密码字段
          delete ret.__v // 删除版本字段
          return ret
        },
      },
    }
  )
  UserSchema.plugin(AutoIncrement, { inc_field: "id", id: "users_id_counter" })

  return app.mongoose.model<UserProps>("User", UserSchema)
}

export default initUserModel
