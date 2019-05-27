const path = require('path')
const fs = require('fs')

const cwd = process.cwd()

// 根目录路径
function resolve(...dir) {
  return path.resolve(cwd, ...dir)
}

// 获取存在文件路径
function resolveFile(...dir) {
  if (fs.existsSync(resolve(...dir))) {
    return resolve(...dir)
  }
  return null
}

// 获取存在文件内容
function requireFile(...dir) {
  const filePath = resolve(...dir)
  if (fs.existsSync(filePath)) {
    return require(filePath)
  }
  return null
}

module.exports = {
  resolve,
  resolveFile,
  requireFile
}
