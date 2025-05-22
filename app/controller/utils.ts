import { Controller, type FileStream } from "egg"
import path, { join, extname } from "path"
import sharp from "sharp"
import { parse } from "path"
import { nanoid } from "nanoid"
import { createWriteStream } from "fs"
import { pipeline } from "stream/promises"
import sendToWormhole from "stream-wormhole"
import COS from "cos-nodejs-sdk-v5"

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

    const savePromise = pipeline(stream, writeStream)
    const transformer = sharp().resize({ width: 300 })
    const thumbPromise = pipeline(stream, transformer, writeThumbnailStream)
    try {
      await Promise.all([savePromise, thumbPromise])
    } catch (error) {
      return ctx.helper.error({
        ctx,
        errorType: "imageUploadFail",
      })
    }
    ctx.helper.success({
      ctx,
      res: {
        url: formatPath(this.pathToURL(savedFilePath)),
        thumbnailUrl: formatPath(this.pathToURL(savedThumbnailPath)),
      },
    })
  }

  async uploadToOSS() {
    const { ctx } = this
    const stream = await ctx.getFileStream()
    const filename = nanoid(6) + extname(stream.filename)
    try {
      const cos = new COS({
        SecretId: process.env.COS_SECRET_ID,
        SecretKey: process.env.COS_SECRET_KEY,
      })
      const result = await cos.putObject({
        Bucket: process.env.COS_BUCKET as string,
        Region: process.env.COS_REGION as string,
        Key: filename,
        Body: stream,
      })
      const { Location } = result
      ctx.helper.success({
        ctx,
        res: {
          filename,
          url: Location,
        },
      })
    } catch (error) {
      await sendToWormhole(stream)
      ctx.helper.error({
        ctx,
        errorType: "imageUploadFail",
        error,
      })
    }
  }

  async uploadMutipleFiles() {
    const { ctx, app } = this
    const { fileSize } = app.config.multipart
    const parts = ctx.multipart({
      limits: {
        fileSize: fileSize as number,
      },
    })
    const urls: string[] = []
    let part: FileStream | string[]
    while ((part = await parts())) {
      if (Array.isArray(part)) {
        // 这里不是文件流
      } else {
        try {
          const filename = nanoid(6) + extname(part.filename)
          const cos = new COS({
            SecretId: process.env.COS_SECRET_ID,
            SecretKey: process.env.COS_SECRET_KEY,
          })
          const result = await cos.putObject({
            Bucket: process.env.COS_BUCKET as string,
            Region: process.env.COS_REGION as string,
            Key: filename,
            Body: part,
          })
          const { Location } = result
          urls.push(Location)
          if (part.truncated) {
            await cos.deleteObject({
              Bucket: process.env.COS_BUCKET as string,
              Region: process.env.COS_REGION as string,
              Key: filename,
            })
            return ctx.helper.error({
              ctx,
              errorType: "imageSizeError",
              error: "文件过大",
            })
          }
        } catch (error) {
          await sendToWormhole(part)
          ctx.helper.error({
            ctx,
            errorType: "imageUploadFail",
            error,
          })
        }
      }
    }
    ctx.helper.success({
      ctx,
      res: {
        urls,
      },
    })
  }

  splidIdAndUuid(str = "") {
    const result = { id: "", uuid: "" }
    if (!str) {
      return result
    }
    const index = str.indexOf("-")
    if (index < 0) {
      return result
    }
    result.id = str.slice(0, index)
    result.uuid = str.slice(index + 1)
    return result
  }

  async renderH5Page() {
    const { ctx } = this
    // id-uuid
    const { id, uuid } = this.splidIdAndUuid(ctx.params.idAndUuid)
    try {
      const pageData = await this.service.utils.renderToPageData({
        id,
        uuid,
      })
      await ctx.render("page.nj", pageData)
    } catch (error) {
      return ctx.helper.error({
        ctx,
        errorType: "pageParamsFail",
        error,
      })
    }
  }
}
