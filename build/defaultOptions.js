const { resolve, resolveFile, requireFile } = require('./utils')

// package.json文件
const pkg = requireFile('package.json') || {}
const pkgName = pkg.name || 'main'

// webpack默认配置
const defaultConfig = {
  port: 8000, // 开发端口
  proxy: {}, // 代理地址
  entry: { [pkgName]: resolve('src') }, // 打包入口 默认： src/index.js
  publicPath: '', // cdn路径 默认：空
  staticPath: resolve('public'), // 静态资源目录 public
  distPath: resolve('dist'), // 输入地址 默认： dist
  html: resolveFile('index.html') || `${__dirname}/../index.html`, // 默认html模板
  libName: pkgName, // 打包文件名字
  externals: {} // 打包忽略
}

// 配置文件
const fileConfig = requireFile('kuan-pack.config.js')

// 最终webpack默认配置
module.exports = {
  ...defaultConfig,
  ...fileConfig
}
