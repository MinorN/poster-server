export const userErrorMessages = {
  createUserValidateFail: {
    errno: 101001,
    message: "用户验证失败",
  },
  createUserAlreadyExists: {
    errno: 101002,
    message: "该用户已存在",
  },
  loginError: {
    errno: 101003,
    message: "账号名或密码错误",
  },
  loginValidateFail: {
    errno: 101004,
    message: "登录失败",
  },
  cellphoneValidateFail: {
    errno: 101005,
    message: "手机号格式不正确",
  },
  sendVerifyCodeFrequently: {
    errno: 101006,
    message: "发送验证码过于频繁",
  },
  loginVeriCodeFail: {
    errno: 101007,
    message: "验证码错误",
  },
  giteeFail: {
    errno: 101008,
    message: "gitee授权失败",
  },
}
