const webpack = require('webpack');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  devtool: isProduction ? 'source-map' : 'eval',
  entry: [
    path.resolve(__dirname, 'js', 'app.js'),
  ],
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.js$/,
      },
    ],
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public', 'build'),
    publicPath: '/build/',
  },
  plugins: [],
};

if (isProduction) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),

    new webpack.NoErrorsPlugin(),

    new webpack.optimize.DedupePlugin(),

    new webpack.optimize.UglifyJsPlugin(),

    new webpack.optimize.OccurenceOrderPlugin(true),

  );
} else {
  config.entry.unshift(
    // For hot style updates
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3000',
  );
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
  );
}

module.exports = config;
