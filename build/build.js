const webpack = require('webpack')
const config = require('./config.prod')

module.exports = (webpackConfig = config, onSuccess) => {
  webpack(webpackConfig, (err, stats) => {
    const message = `${stats.toString({ colors: true })} \n`
    if (err || stats.hasErrors()) {
      process.stdout.write('\x07') // 声音报警
      console.error(err || message)
      process.exit(1)
    }

    if (onSuccess) {
      onSuccess({
        stats
      })
    }
    console.log(message)
  })
}
