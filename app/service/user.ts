import { Service } from "egg"
import { UserProps } from "../model/user"

interface GiteeUserResp {
  id: number
  login: string
  name: string
  avatar_url: string
  email: string
}

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

  // 获取 gitee access token
  async getAccessToken(code: string) {
    const { ctx } = this
    const { cid, secret, auth_url, redirect_url } =
      ctx.app.config.giteeOauthConfig
    const { data } = await ctx.curl(auth_url, {
      method: "POST",
      contentType: "json",
      dataType: "json",
      data: {
        code,
        client_id: cid,
        redirect_uri: redirect_url,
        client_secret: secret,
      },
    })
    return data.access_token
  }

  // 获取 gitee user data
  async getGiteeUserData(access_token: string): Promise<GiteeUserResp> {
    const { ctx } = this
    const { giteeUserAPI } = ctx.app.config.giteeOauthConfig
    const { data } = await ctx.curl<GiteeUserResp>(
      `${giteeUserAPI}?access_token=${access_token}`,
      {
        dataType: "json",
      }
    )
    return data
  }

  async loginByGitee(code: string) {
    const access_token = await this.getAccessToken(code)
    const user = await this.getGiteeUserData(access_token)
    // 检查用户是否存在
    const { id, name, avatar_url, email } = user
    const stringId = id.toString()
    const existUser = await this.findByUsername(`gitee-${stringId}`)
    // 存在用户
    if (existUser) {
      const token = this.app.jwt.sign(
        {
          username: existUser.username,
        },
        this.app.config.jwt.secret
      )
      return token
    }
    const userCreatedData: Partial<UserProps> = {
      oauthID: stringId,
      provider: "gitee",
      username: `gitee-${stringId}`,
      email,
      picture: avatar_url,
      nickname: name,
      type: "oauth",
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
