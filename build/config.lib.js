const fs = require('fs')
const WebpackBar = require('webpackbar')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const loaders = require('./loaders')

// 默认配置
const defaultOptions = require('./defaultOptions')

const { resolve } = require('./utils')

// 支持覆盖配置
module.exports = userOptions => {
  const options = {
    ...defaultOptions,
    distPath: resolve('lib'),
    ...userOptions
  }
  return {
    mode: 'production',
    entry: options.entry,
    output: {
      path: options.distPath,
      publicPath: options.publicPath,
      filename: `${options.libName}.js`
    },
    module: {
      noParse: [/moment.js/],
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: loaders.babelLoader
        },
        {
          test: /\.css$/,
          use: loaders.generateCssLoader(false)
        },
        {
          test: /\.scss$/,
          use: loaders.generateSassLoader(false)
        },
        {
          test: /\.less$/,
          use: loaders.generateLessLoader(false)
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico|svg)$/gi,
          use: loaders.generateUrlLoader('images')
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: loaders.generateUrlLoader('fonts')
        }
      ]
    },
    plugins: [
      new WebpackBar(),
      new CopyWebpackPlugin(
        fs.existsSync(options.staticPath)
          ? [
              {
                from: options.staticPath,
                to: '',
                ignore: ['.*']
              }
            ]
          : []
      )
    ],
    resolve: {
      extensions: ['.js', '.scss'],
      alias: {
        '@': resolve('src')
      }
    },
    externals: options.externals,
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            warnings: false
          }
        })
      ]
    }
  }
}
