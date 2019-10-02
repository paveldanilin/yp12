class User {
  constructor(id, name, about, avatar) {
    this.id = id;
    this.name = name;
    this.about = about;
    this.avatar = avatar;
  }

  static create({
    id = null,
    name = '',
    about = '',
    avatar = '',
  } = {}) {
    return new User(id, name, about, avatar);
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  getAbout() {
    return this.about;
  }

  setAbout(about) {
    this.about = about;
    return this;
  }

  getAvatar() {
    return this.avatar;
  }

  setAvatar(avatar) {
    this.avatar = avatar;
    return this;
  }
}

module.exports = User;
