const User = require('./user');
const UserCollection = require('./collection');
const BaseNormalizer = require('../base-normalizer');

class UserNormalizer extends BaseNormalizer {
  constructor() {
    super(User);
  }

  // eslint-disable-next-line class-methods-use-this
  supportNormalization(obj) {
    return obj instanceof User;
  }

  // eslint-disable-next-line class-methods-use-this
  doNormalize(obj) {
    return {
      _id: obj.getId(),
      name: obj.getName(),
      about: obj.getAbout(),
      avatar: obj.getAvatar(),
    };
  }

  // eslint-disable-next-line
  supportDenormalization(data) {
    // eslint-disable-next-line no-underscore-dangle
    return (data._id || data.id) && data.name;
  }

  // eslint-disable-next-line class-methods-use-this
  doDenormalize(data) {
    // TODO: Check is data suitable for demoralization?
    return User.create({
      // eslint-disable-next-line no-underscore-dangle
      id: data._id || data.id || null,
      name: data.name,
      about: data.about,
      avatar: data.avatar,
    });
  }

  doDenormalizeArray(array, serializer) {
    return new UserCollection(
      array.map((userData) => this.doDenormalize(userData, null, serializer)),
    );
  }
}

module.exports = UserNormalizer;
