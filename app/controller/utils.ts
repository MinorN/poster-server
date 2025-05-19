import { Controller } from "egg"
import path from "path"

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
    const url = formatPath(
      file.filepath.replace(ctx.app.config.baseDir, ctx.app.config.baseUrl)
    )
    ctx.helper.success({
      ctx,
      res: {
        url,
      },
    })
  }
}
