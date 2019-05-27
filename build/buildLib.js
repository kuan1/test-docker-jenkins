const getConfigLib = require('./config.lib')
const build = require('./build')

// 可传入默认配置
module.exports = (options, onSuccess) => {
  const webpackConfig = getConfigLib(options)
  build(webpackConfig, onSuccess)
}
