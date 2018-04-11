const path = require('path');

module.exports = function (env, args) {
  const config = {
    entry: './src/background.js',
    output: {
      filename: 'background.bundle.js',
      path: path.resolve(__dirname, 'dist')
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
  } else {
    config.mode = 'development';
    config.devtool = 'source-map';
  }

  return config;
};