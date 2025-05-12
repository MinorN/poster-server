import { Application } from "egg"

export interface UserProps {
  username: string
  password: string
  email?: string
  nickname?: string
  picture?: string
  phoneNumber?: string
  createdAt: Date
  updatedAt: Date
}

function initUserModel(app: Application) {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const userSchema = new Schema<UserProps>(
    {
      username: { type: String, unique: true, required: true },
      password: { type: String, required: true },
      email: { type: String },
      nickname: { type: String },
      picture: { type: String },
      phoneNumber: { type: String },
    },
    { timestamps: true }
  )
  return app.mongoose.model<UserProps>("User", userSchema)
}

export default initUserModel
