const fs = require('fs');
const BaseProvider = require('./base-provider');

class FileProvider extends BaseProvider {
  // eslint-disable-next-line class-methods-use-this
  doLoad({ filename = '' } = {}, onError, onData) {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        onError(err);
      } else {
        onData(data);
      }
    });
  }
}

module.exports = FileProvider;
