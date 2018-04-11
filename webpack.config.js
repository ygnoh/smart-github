const path = require('path');

module.exports = function (env, args) {
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
        }
      ]
    }
  };

  if (env && env.production) {
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