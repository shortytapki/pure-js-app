const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';
const fromCopyPattern = path.resolve(__dirname, 'src/favicon.ico');
const toCopyPattern = path.resolve(__dirname, 'dist');

const filename = (ext) => (isProd ? `bundle.[hash].${ext}` : `bundle.${ext}`);
const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ];

  if (!isProd) loaders.push('eslint-loader');

  return loaders;
};

console.log('IS PROD:', isProd);

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],

  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  devtool: isProd ? false : 'source-map',
  devServer: {
    port: 3000,
    watchFiles: [
      path.resolve(__dirname, 'src/index.html'),
      path.resolve(__dirname, 'src'),
    ],
    hot: true,
    liveReload: false,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),
    new CopyPlugin({
      patterns: [{ from: fromCopyPattern, to: toCopyPattern }],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};
