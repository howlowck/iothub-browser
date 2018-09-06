const path = require('path')

module.exports = {
  entry: {
    index: './src/index.js',
    connectDevice: './src/connectDevice.js',
    monitorEvents: './src/monitorEvents.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'iothubBrowser',
    libraryTarget: 'umd'
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}
