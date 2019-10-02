const path = require('path');

function getPublicPath() {
  return process.env.NODE_ENV === 'production' ? './public' : path.join(__dirname, '../public');
}

function getDataPath() {
  return process.env.NODE_ENV === 'production' ? './data' : path.join(__dirname, '../data');
}

module.exports = {
  getPublicPath,
  getDataPath,
};
