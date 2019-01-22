const path = require('path');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: './src/js/index.js',
  mode: 'development',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, './app/dist/js'),
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: ['babel-loader','ts-loader'],
        exclude: [/node_modules/,nodeModulesPath]
      },
      {
        test: /\.js?$/,
        include: [path.resolve(__dirname, './src/js')],
        loader: 'babel-loader',
      },
    ],
  },
};
