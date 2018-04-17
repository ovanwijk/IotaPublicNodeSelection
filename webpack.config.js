const path = require('path');

module.exports = {
  mode:'development',
  entry: './src/ServerSelection.js',
  output: {
    filename: 'IotaPublicNodeSelection.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'var',
    library: 'IotaPublicNodeSelection'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  }
};