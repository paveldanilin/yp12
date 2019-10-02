const FileProvider = require('../../providers/file-provider');
const utils = require('../../utils');

class FileCardProvider extends FileProvider {
  constructor(serializer) {
    super();
    this.serializer = serializer;
  }

  load(onError, onData) {
    super.load({
      filename: `${utils.getDataPath()}/cards.json`,
    },
    (e) => onError(e),
    (d) => {
      const cards = this.serializer.deserialize(d, 'Card');
      onData(cards);
    });
  }
}

module.exports = FileCardProvider;
