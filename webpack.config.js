const path = require('path');

const webpackConfig = {

  entry: {
    story: './src/main.ts'
  },

  output: {
    filename: './dist/story.js',
    library: 'story-graph',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  resolve: {
    extensions: ['.js', '.json', '.ts', '.d.ts'],
    modules: [
      'node_modules',
      path.resolve('./'),
    ]
  },

  module: {
    loaders: [
      { test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  }
}

module.exports = webpackConfig
