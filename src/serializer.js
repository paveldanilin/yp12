const JsonEncoder = require('./models/json-encoder');
const Serializer = require('./models/serializer');
const UserNormalizer = require('./models/user/normalizer');
const CardNormalizer = require('./models/card/normalizer');

const instance = new Serializer(new JsonEncoder());

instance.registerNormalizer('User', new UserNormalizer());
instance.registerNormalizer('Card', new CardNormalizer());

module.exports = { instance };
