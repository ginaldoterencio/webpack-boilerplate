if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const opn = require('opn');
const webpackConfig = require('./webpack.config');
const port = '8080';
const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  inline: true,
  hot: true,
  stats: {
    colors: true,
    chunks: false
  }
});

const hotMiddleware = require('webpack-hot-middleware')(compiler);

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
// var staticsPath = path.posix.join(webpackConfig.output.publicPath, 'assets/statics/');
// app.use(staticsPath, express.static('./src/assets/statics'));

app.use('/assets/statics', express.static(path.join(__dirname, '../src/assets/statics')));


module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  var uri = 'http://localhost:' + port;
  console.log('Listening at ' + uri + '\n');
  console.log('Building. Please wait...');

  // open browser if set so in /config/index.js and not on unit/e2e testing
  // if (config.dev.openBrowser && process.env.NODE_ENV !== 'testing') {
  //   opn(uri)
  // }
  opn(uri);
})
