const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const loaders = require('./loaders')
const options = require('./defaultOptions')

const { resolve } = require('./utils')

module.exports = {
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
        use: loaders.generateCssLoader()
      },
      {
        test: /\.scss$/,
        use: loaders.generateSassLoader()
      },
      {
        test: /\.less$/,
        use: loaders.generateLessLoader()
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
    new HtmlWebpackPlugin({
      template: options.html,
      path: options.publicPath,
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
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
  }
}
