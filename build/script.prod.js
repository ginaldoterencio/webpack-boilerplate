if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const shell = require('shelljs');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.prod.conf');
const targetPath = path.join(__dirname, '../dist');

require('./script.clean.js');
console.log(' Building...');

webpack(webpackConfig, function (err, stats) {
  if (err) {
    throw err;
  }

  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n');
});
