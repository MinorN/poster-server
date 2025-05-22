import { Service } from "egg"
import { createSSRApp } from "vue"
import MPosterComponent from "m-poster-component"
import { renderToString } from "@vue/server-renderer"

export default class UtilsService extends Service {
  propsToSrtle(props = {}) {
    const keys = Object.keys(props)
    const styleArray = keys.map((key) => {
      const formatKey = key.replace(/([A-Z])/g, "-$1").toLowerCase()
      const value = props[key]
      return `${formatKey}:${value}`
    })
    return styleArray.join(";")
  }

  px2vw(components: []) {
    const reg = /^(\d+(\.\d+)?)px$/
    components.forEach((item: any = []) => {
      const props = item.props || {}
      Object.keys(props).forEach((key) => {
        const val = props[key]
        if (typeof val !== "string") {
          return
        }
        if (!reg.test(val)) {
          return
        }
        const arr = val.match(reg) || []
        const numStr = arr[1]
        const num = parseFloat(numStr)
        const vw = (num / 375) * 100
        props[key] = `${vw.toFixed(2)}vw`
      })
    })
  }

  async renderToPageData(query: { id: string; uuid: string }) {
    const work = await this.ctx.model.Work.findOne(query).lean()
    if (!work) {
      throw new Error("work not exist")
    }
    const { title, desc, content } = work
    this.px2vw(content && content.components)
    const vueApp = createSSRApp({
      data: () => {
        return {
          components: (content && content.components) || [],
        }
      },
      template: '<final-page :components="components"></final-page>',
    })
    vueApp.use(MPosterComponent)
    const html = await renderToString(vueApp)
    const bodyStyle = this.propsToSrtle(content && content.props)
    return {
      html,
      title,
      desc,
      bodyStyle,
    }
  }
}
