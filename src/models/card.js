const mongoose = require('mongoose');
const validator = require('validator');
const Joi = require('joi');

const schema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: (value) => {
      if (!validator.isURL(value)) {
        throw new Error('Invalid card link');
      }
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

schema.statics.getSchema = () => Joi.object().keys({
  name: Joi.string().min(2).max(30),
  link: Joi.string().uri(),
  owner: Joi.object(),
  likes: Joi.array().items(Joi.object()),
});

schema.statics.getCreateSchema = () => Joi.object().keys({
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string().uri().required(),
  owner: Joi.object().required(),
  likes: Joi.array().items(Joi.object()),
});

const CardModel = mongoose.model('Card', schema);

module.exports = CardModel;
