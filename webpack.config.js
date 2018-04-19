const path = require('path');


var rules = [
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

var serverConfig = {
  mode:'development',
  target: 'node',
  entry: './src/ServerSelection.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'IotaPublicNodeSelection.js'
  },
  module: {
    rules: rules
  }
  //…
};

var clientConfig = {
  mode:'development',
  target: 'web', // <=== can be omitted as default is 'web'
  entry: './src/ServerSelection.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'IotaPublicNodeSelection.web.js',
    libraryTarget: 'var',
    library: 'iotapublicnodeselection'
  },
  module: {
    rules: rules
  }
  //…
};



module.exports = [serverConfig, clientConfig];