const webpackConfig = {
  entry: {
    story: './src/main.js'
  },

  output: {
    filename: './dist/story.js',
    library: 'story-graph',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    loaders: [
      { test: /\.js?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-2'],
        }
      }
    ]
  }
}

module.exports = webpackConfig
