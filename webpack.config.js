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
    libraryTarget: 'commonjs2',
    library: 'iotapublicnodeselection'
  },
  module: {
    rules: rules
  }
  
};

var clientConfig = {
  mode:'development',
  target: 'web', // 
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
  }]
  
};



module.exports = [serverConfig, clientConfig];