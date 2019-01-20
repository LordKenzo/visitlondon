const path = require('path');

module.exports = {
  entry: './src/js/index.js',
  mode: 'development',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, './app/dist/js'),
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [path.resolve(__dirname, './src/js')],
        loader: 'babel-loader',
      },
    ],
  },
};
