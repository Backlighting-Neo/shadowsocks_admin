const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    'whatwg-fetch',
    './src/index.js'
  ],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../dist/')
  },
  devtool: 'source-map',
  devServer: {
    contentBase: '../dist',
    hot: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:10005',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*'], {
      root: path.resolve(__dirname, '../')
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
    },{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.html$/,
      loader: 'html-withimg-loader'
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: path.posix.join('static', 'img', '[name].[hash:7].[ext]')
      }
    },]
  }
};