const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'iothub-browser.min.js',
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
