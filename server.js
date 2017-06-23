"use strict";

import express from 'express';
import path from 'path';

const PRODUCTION = process.env.NODE_ENV === 'production';

const APP_PORT = PRODUCTION && process.env.PORT
  ? process.env.PORT
  : 3000;

// Serve the Relay app
let app = null;

if (PRODUCTION) {
  app = express();
} else {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');

  const config = require('./webpack.config.js');
  const compiler = webpack(config);
  
  app = new WebpackDevServer(compiler, {
    contentBase: '/public/',
    publicPath: '/build/',
    stats: {colors: true},
  });
}

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
