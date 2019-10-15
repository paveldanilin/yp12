const path = require('path');

function getPublicPath() {
  return process.env.NODE_ENV === 'production' ? './public' : path.join(__dirname, '../public');
}

module.exports = {
  getPublicPath,
};
