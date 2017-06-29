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
  // eslint-disable-next-line global-require
  const webpack = require('webpack');
  // eslint-disable-next-line global-require
  const WebpackDevServer = require('webpack-dev-server');

  // eslint-disable-next-line global-require
  const config = require('./webpack.config.js');
  const compiler = webpack(config);

  app = new WebpackDevServer(compiler, {
    contentBase: '/public/',
    publicPath: '/build/',
    stats: { colors: true },
  });
}

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
