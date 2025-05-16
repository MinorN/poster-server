import { Service } from "egg"
import { UserProps } from "../model/user"

export default class UserService extends Service {
  public async createByEmail(payload: UserProps) {
    const { ctx } = this
    const { username, password } = payload
    const hash = await ctx.genHash(password)
    const userCreatedData: Partial<UserProps> = {
      username,
      password: hash,
      email: username,
    }
    return ctx.model.User.create(userCreatedData)
  }

  async findById(id: string) {
    return this.ctx.model.User.findById(id)
  }

  async findByUsername(username: string) {
    return this.ctx.model.User.findOne({
      username,
    })
  }
  async loginByCellphone(cellphone: string) {
    const user = await this.findByUsername(cellphone)
    if (user) {
      const token = this.app.jwt.sign(
        {
          username: user.username,
        },
        this.app.config.jwt.secret
      )
      return token
    }
    // 新建用户
    const userCreatedData: Partial<UserProps> = {
      username: cellphone,
      phoneNumber: cellphone,
      nickname: `poster${cellphone.slice(-4)}`,
      type: "cellphone",
    }
    const newUser = await this.ctx.model.User.create(userCreatedData)
    const token = this.app.jwt.sign(
      {
        username: newUser.username,
      },
      this.app.config.jwt.secret
    )
    return token
  }
}
