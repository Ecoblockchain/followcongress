var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    main: [
      './src/main.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'www', 'build'),
    publicPath: "/build/",
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: path.join(__dirname, 'src'),
        query: {
          presets: ['es2015', "react", "stage-1"],
        },
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.html/,
        loaders: ['html']
      }
    ]
  },
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin()
  ],
  stats: {
    // Nice colored output
    colors: true
  },
  // Create Sourcemaps for the bundle
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    inline: true
  }
};