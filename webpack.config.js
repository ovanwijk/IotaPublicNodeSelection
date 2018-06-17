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
    filename: 'IotaPublicNodeSelection.js',
    libraryTarget: 'umd',
    library: 'iotapublicnodeselection'
  },
  module: {
    rules: rules
  },
  node: {
    fs: 'empty',
    child_process: 'empty',
    path: 'empty'
  }
  
};

var clientConfig = {
  mode:'development',
  target: 'web',
  entry: './src/ServerSelection.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'IotaPublicNodeSelection.web.js',
    libraryTarget: 'var',
    library: 'iotapublicnodeselection'
  },
  module: {
    rules: rules
  },
  externals:[{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  node: {
    fs: 'empty',
    child_process: 'empty',
    path: 'empty'
  }
  
};



module.exports = [serverConfig, clientConfig];