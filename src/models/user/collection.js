const User = require('./user');
const BaseCollection = require('../base-collection');

class UserCollection extends BaseCollection {
  constructor(users = []) {
    super('User', {
      id: 'string',
      name: 'string',
      about: 'string',
      avatar: 'string',
    });

    users.forEach((user) => this.add(user));
  }

  // eslint-disable-next-line class-methods-use-this
  supportedType(item) {
    return item instanceof User;
  }

  // eslint-disable-next-line class-methods-use-this
  fromArray(array) {
    return new UserCollection(array);
  }
}

module.exports = UserCollection;
