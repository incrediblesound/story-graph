const path = require('path');

const webpackConfig = {
  target: 'node',
  entry: {
    story: './src/main.ts'
  },

  output: {
    filename: 'story.js',
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
    rules: [
      { test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  }
}

module.exports = webpackConfig
