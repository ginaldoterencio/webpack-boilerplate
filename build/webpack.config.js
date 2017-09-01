const env = process.env.NODE_ENV;
const isDev = env === 'development';

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const eslintFormatter = require('eslint-friendly-formatter');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = require('../src/config.json');
const data = require('../src/data/index.js');

const sourceDir = path.join(__dirname, '../src/');

const nunjucksConfig = JSON.stringify({
  searchPaths: [`${sourceDir}'html/`],
  context: data,
});

const pages = [];

config.html.forEach((page) => {
  pages.push(new HtmlWebpackPlugin({
    filename: config.html[page].filename,
    template: config.html[page].template,
  }));
});

// const entries = {};

// for(page in output.config.css) {
//   entries
//   pages.push(new HtmlWebpackPlugin({
//     filename: config.pages[page].filename,
//     template: config.pages[page].template
//   }))
// }

module.exports = {
  context: sourceDir,
  devtool: 'source-map',
  entry: {
    app: [
      './assets/js/app.js',
      './assets/scss/app.scss',
      '../build/hot-reload',
    ],
  },
  output: {
    publicPath: 'http://localhost:8080/',
    filename: 'assets/js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader',
        enforce: 'pre',

      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',

      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap'],
        // use: ExtractTextPlugin.extract({
        //   use: 'css-loader?sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap',
        //   fallback: 'style-loader'
        // })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          query: {
            limit: 10000,
            name: 'assets/img/[name].[hash:8].[ext]'
          },
        },
      },
      {
        include: /\.(njk|nunjucks|html|json)$/,
        use: ['html-loader', `nunjucks-html-loader?${nunjucksConfig}`],
      },
    ],
  },
  plugins: [
    ...pages,
    new webpack.DefinePlugin({
      'proccess.env': {
        NODE_ENV: JSON.stringify(env),
      },
    }),
    new StyleLintPlugin({
      configFile: path.join(__dirname, '../.stylelintrc'),
      syntax: 'scss',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: 2,
      filename: isDev ? 'assets/js/vendor.js' : 'assets/js/vendor.[hash].js',
    }),
    new ExtractTextPlugin(isDev ? 'assets/css/[name].css' : 'assets/css/[name].[hash:8].css'),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer(),
        ],
        eslint: {
          formatter: eslintFormatter,
        },
      },
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new CopyWebpackPlugin([{
      context: path.join(__dirname, 'src/assets/statics'),
      from: '**/*',
      to: path.join(__dirname, 'dist/assets/statics'),
    }]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};
