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
  password: {
    type: String,
    required: true,
    minlength: 7,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
});

schema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

schema.methods.createToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

schema.statics.loadUserByCredentials = async (name, password) => {
  // eslint-disable-next-line no-use-before-define
  const user = await UserModel.findOne({ name });

  if (!user) {
    throw new Error('Invalid login credentials');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error('Bad password');
  }
  return user;
};

const UserModel = mongoose.model('User', schema);

module.exports = UserModel;
