import { Controller } from "egg"
import path, { join, extname } from "path"
import sharp from "sharp"
import { parse } from "path"
import { nanoid } from "nanoid"
import { createWriteStream } from "fs"

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

  pathToURL(path: string) {
    return path.replace(this.app.config.baseDir, this.app.config.baseUrl)
  }

  async fileUploadByStream() {
    const { ctx } = this
    const stream = await ctx.getFileStream()
    const uid = nanoid(6)
    const savedFilePath = join(
      ctx.app.config.baseDir,
      "uploads",
      uid + extname(stream.filename)
    )
    const savedThumbnailPath = join(
      ctx.app.config.baseDir,
      "uploads",
      uid + "_thumb" + extname(stream.filename)
    )
    const writeStream = createWriteStream(savedFilePath)
    const writeThumbnailStream = createWriteStream(savedThumbnailPath)

    const savePromise = new Promise((resolve, reject) => {
      stream
        .pipe(writeStream)
        .on("finish", resolve as any)
        .on("error", reject)
    })
    const transformer = sharp().resize({ width: 300 })
    const thumbPromise = new Promise((resolve, reject) => {
      stream
        .pipe(transformer)
        .pipe(writeThumbnailStream)
        .on("finish", resolve as any)
        .on("error", reject)
    })

    await Promise.all([savePromise, thumbPromise])
    ctx.helper.success({
      ctx,
      res: {
        url: formatPath(this.pathToURL(savedFilePath)),
        thumbnailUrl: formatPath(this.pathToURL(savedThumbnailPath)),
      },
    })
  }
}
