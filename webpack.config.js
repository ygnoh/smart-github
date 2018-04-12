const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env = {}, args = {}) => {
  const config = {
    entry: {
      background: './src/background.js',
      content: './src/content.js',
      popup: './src/popup.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css'
      })
    ]
  };

  if (env.production) {
    config.mode = 'production';
    config.output = {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    };
  } else {
    config.mode = 'development';
    config.devtool = 'source-map';
    config.output = {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist-dev')
    };
  }

  return config;
};