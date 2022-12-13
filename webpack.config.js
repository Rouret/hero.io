const path = require('path');

module.exports = {
  entry: './src/front/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.png/,
        type: 'asset/resource'
      },
      {
        test: /\.html/,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]'
        }
      }
    ],
  },
  output: {
    filename: 'bootstrap.js',
    path: path.resolve(__dirname, 'dist/js'),
    assetModuleFilename: './images/[hash][ext][query]'
  },
};