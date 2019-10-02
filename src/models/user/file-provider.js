const FileProvider = require('../../providers/file-provider');
const utils = require('../../utils');

class FileUserProvider extends FileProvider {
  constructor(serializer) {
    super();
    this.serializer = serializer;
  }

  load(onError, onData) {
    super.load({
      filename: `${utils.getDataPath()}/users.json`,
    },
    (e) => onError(e),
    (d) => {
      const users = this.serializer.deserialize(d, 'User');
      onData(users);
    });
  }
}

module.exports = FileUserProvider;
