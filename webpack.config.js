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
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bootstrap.js',
    path: path.resolve(__dirname, 'dist/js'),
  },
};