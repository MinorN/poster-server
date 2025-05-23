const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const FileManagerPlugin = require("filemanager-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const dovenv = require("dotenv")

const buildFileDest = path.resolve(__dirname, "../app/public")
const templateFileDest = path.resolve(__dirname, "../app/view")
const envPath = path.resolve(__dirname, "../.env")
dovenv.config({
  path: envPath,
})

/**
 * @type {import('webpack').Configuration}
 */
module.exports = (env) => {
  return {
    mode: "production",
    context: path.resolve(__dirname, "../webpack"),
    entry: "./index.js",
    output: {
      path: buildFileDest,
      filename: "bundle.[hash].js",
      publicPath: env.production ? process.env.COS_PATH : "/public/",
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].[hash].css",
      }),
      new HtmlWebpackPlugin({
        filename: "page.nj",
        template: path.resolve(__dirname, "./template.html"),
      }),
      // copy 文件到 view 下
      new FileManagerPlugin({
        events: {
          onEnd: {
            copy: [
              {
                source: path.join(buildFileDest, "page.nj"),
                destination: path.join(templateFileDest, "page.nj"),
              },
            ],
          },
        },
      }),
    ],
  }
}
