const COS = require("cos-nodejs-sdk-v5")
const dovenv = require("dotenv")
const path = require("path")
const fs = require("fs")

const envPath = path.resolve(__dirname, "../.env")
dovenv.config({
  path: envPath,
})
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
})

const bucket = process.env.COS_BUCKET
const region = process.env.COS_REGION

const publicPath = path.resolve(__dirname, "../app/public")
async function run() {
  const publicFiles = fs.readdirSync(publicPath)
  const files = publicFiles.filter((f) => f !== "page.nj")
  const res = await Promise.all(
    files.map(async (fileName) => {
      const saveOssPath = "/h5-assets/" + fileName
      const filePath = path.join(publicPath, fileName)
      const result = await cos.putObject({
        Bucket: bucket,
        Region: region,
        Key: saveOssPath,
        Body: fs.createReadStream(filePath),
      })
      const { Location } = result
      return Location
    })
  )
  console.log("上传成功", res)
}

run()
