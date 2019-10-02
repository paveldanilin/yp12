class Card {
  constructor(id, name, link, likes, owner, createdAt) {
    this.id = id;
    this.name = name;
    this.link = link;
    this.likes = likes;
    this.owner = owner;
    this.createdAt = createdAt;
  }

  static create({
    id = null,
    name = '',
    link = '',
    likes = [],
    owner = {},
    createdAt = null,
  } = {}) {
    let withCreatedAt = createdAt;
    if (!withCreatedAt) {
      withCreatedAt = new Date();
    }
    return new Card(id, name, link, likes, owner, withCreatedAt);
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getLikes() {
    return this.likes;
  }

  getLink() {
    return this.link;
  }

  getOwner() {
    return this.owner;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}

module.exports = Card;
