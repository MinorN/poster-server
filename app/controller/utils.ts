import { Controller } from "egg"
import path from "path"
import sharp from "sharp"
import { parse } from "path"

function formatPath(p: string) {
  if (!p) {
    return p
  }
  const sep = path.sep // mac:/ windows:\
  if (sep === "/") {
    return p
  } else {
    return p.replace(/\\/g, "/")
  }
}

export default class UtilsController extends Controller {
  async fileLocalUpload() {
    const { ctx } = this
    const file = ctx.request.files[0]
    const { filepath } = file
    const imageSource = sharp(filepath)
    const metaData = await imageSource.metadata()
    const { width } = metaData
    let url = formatPath(
      filepath.replace(ctx.app.config.baseDir, ctx.app.config.baseUrl)
    )
    if (width && width > 300) {
      // 生成一个新的路径
      const { name, ext, dir } = parse(filepath)
      const newPath = path.join(dir, `${name}-thumb${ext}`)
      await imageSource.resize({ width: 300 }).toFile(newPath)
      url = formatPath(
        newPath.replace(ctx.app.config.baseDir, ctx.app.config.baseUrl)
      )
    }
    ctx.helper.success({
      ctx,
      res: {
        url,
      },
    })
  }
}
