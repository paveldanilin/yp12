const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: {
    app: ['./src/app.js'],
  },
  output: {
    path: path.resolve(__dirname, ''),
    filename: 'app.js',
  },
  externals: [nodeExternals()],
};
