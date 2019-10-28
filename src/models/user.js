const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: (value) => {
      if (!validator.isURL(value)) {
        throw new Error('Invalid avatar link');
      }
    },
  },
  email: {
    type: String,
    unique: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error('Bad email');
      }
    },
  },
  password: {
    type: String,
    // required: true,
    minlength: 7,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
});

async function preSave(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
}

async function createToken() {
  const user = this;
  const payload = { _id: user._id };
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
}

schema.pre('save', preSave);
schema.methods.createToken = createToken;

schema.statics.loadUserByCredentials = async (email, password) => {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Unknown user');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Bad password');
  }
  return user;
};

schema.statics.loadUserByToken = (token) => {
  const payload = jwt.verify(token, process.env.JWT_KEY);
  return this.findOne({ _id: payload._id, 'tokens.token': token });
};

const UserModel = mongoose.model('User', schema);

module.exports = UserModel;
