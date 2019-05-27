const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-transform-runtime']
  }
}

const generateCssLoader = (extract = true) => [
  extract ? MiniCssExtractPlugin.loader : 'style-loader',
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        require('autoprefixer')({
          browsers: ['> 1%', 'last 2 versions']
        })
      ]
    }
  }
]

const generateSassLoader = (extract = true) => [
  ...generateCssLoader(extract),
  'sass-loader'
]

const generateLessLoader = (extract = true) => [
  ...generateCssLoader(extract),
  {
    loader: 'less-loader',
    options: {
      javascriptEnabled: true
    }
  }
]

const generateUrlLoader = (dir = 'images') => ({
  loader: 'url-loader',
  options: {
    limit: 5000,
    name: `${dir}/[name].[ext]?[hash]`
  }
})

module.exports = {
  babelLoader,
  generateCssLoader,
  generateSassLoader,
  generateLessLoader,
  generateUrlLoader
}
