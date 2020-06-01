const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const env = process.env.NODE_ENV;
const apiRoutes = require('../routes');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', apiRoutes);
app.use(express.static(path.resolve(__dirname, '..') + '/dist'));

if (env === 'development') {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackConfig = require('./webpack');
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      modules: false,
      entrypoints: false,
      assets: false,
    },
  }));
  app.get('*', (req, res, next) => {
    const filename = path.resolve(compiler.outputPath, 'index.html');
    return compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) return next(err);
      res.set('content-type', 'text/html');
      res.send(result);
      return res.end();
    });
  });
} else {
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '..') + '/public/index.html'));
}

module.exports = app;
