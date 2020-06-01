require('dotenv').config({path: `${process.cwd()}/.env`});

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const env = process.env.NODE_ENV;
const dir = path.resolve(__dirname, '..');

const options = {
  mode: env,
  entry: ['@babel/polyfill', `${dir}/src/index.js`],
  output: {
    path: `${dir}/dist`,
    publicPath: '/',
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', {discardComments: {removeAll: true}}],
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        `${dir}/dist`,
      ],
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: env === 'development' ? 'css/[name].css' : 'css/[name].[hash:8].css',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: `${dir}/index.html`,
      minify: {
        html5: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: false,
        removeComments: true,
      },
    }),
    new LiveReloadPlugin({
      port: 0,
      appendScriptTag: env === 'development' ? true : false,
    }),
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    }
  }
};

module.exports = options;
