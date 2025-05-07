import axios, { AxiosInstance } from "axios"
import { Application } from "egg"

const AXIOS = Symbol("Application#axios")

export default {
  echo(msg: string) {
    const that = this as unknown as Application
    return `hello,${that.config.name},${msg}`
  },
  get axiosInstance(): AxiosInstance {
    if (!this[AXIOS]) {
      this[AXIOS] = axios.create({
        baseURL: "",
        timeout: 5000,
      })
    }
    return this[AXIOS]
  },
}
